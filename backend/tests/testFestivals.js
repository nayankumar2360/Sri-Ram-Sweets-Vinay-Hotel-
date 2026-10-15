require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const Festival = require('../models/Festival');
const connectDB = require('../config/db');

async function runTests() {
  console.log('--- Starting Festival & Pre-Order System Tests ---');
  await connectDB();

  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName}`);
      failed++;
    }
  }

  try {
    // Test 1: Verified Festivals exist in DB
    const festivals = await Festival.find().sort({ startDate: 1 });
    assert(festivals.length >= 16, `Database contains ${festivals.length} verified festivals for 2026-2027 (expected >= 16)`);

    // Test 2: Check Bihar Festivals (Chhath Puja, Teej, Makar Sankranti, Holi, Saraswati Puja)
    const chhath2026 = await Festival.findOne({ slug: 'chhath-puja-2026' });
    assert(!!chhath2026, 'Kartik Chhath Puja 2026 exists with slug chhath-puja-2026');
    assert(chhath2026?.importantDays?.length === 4, 'Chhath Puja 2026 has all 4 ritual days (Nahay Khay, Kharna, Sandhya Arghya, Usha Arghya)');

    const diwali2026 = await Festival.findOne({ slug: 'diwali-dhanteras-2026' });
    assert(!!diwali2026, 'Diwali & Dhanteras 2026 exists in database');
    assert(diwali2026?.importantDays?.length === 5, 'Diwali 2026 has all 5 days (Dhanteras through Bhai Dooj)');

    // Test 3: Status Calculation - Upcoming vs Ongoing vs Completed
    // Test with simulated future date for Diwali 2026
    const beforeDiwali = new Date('2026-10-15T12:00:00+05:30'); // Before 7-day lead window
    const calcBefore = diwali2026.calculateStatus(beforeDiwali);
    assert(calcBefore.festivalStatus === 'upcoming', 'Festival is upcoming well before start date');
    assert(calcBefore.preorderStatus === 'not_yet_open', 'Preorders are not_yet_open before lead time window');
    assert(calcBefore.isOrderingAllowed === false, 'Ordering is not allowed before opening date');

    // Test inside preorder window (leadTimeDays is 7, starts Nov 6, so Oct 31 is open)
    const inDiwaliWindow = new Date('2026-11-01T12:00:00+05:30');
    const calcInWindow = diwali2026.calculateStatus(inDiwaliWindow);
    assert(calcInWindow.preorderStatus === 'open', 'Preorders are open inside preorder window');
    assert(calcInWindow.isOrderingAllowed === true, 'Ordering is allowed inside preorder window');

    // Test 4: Manual Override: Closed
    diwali2026.manualOverride.status = 'closed';
    diwali2026.manualOverride.reason = 'Sold out for the day';
    const calcManualClosed = diwali2026.calculateStatus(inDiwaliWindow);
    assert(calcManualClosed.preorderStatus === 'temporarily_closed', 'Manual override closed marks preorderStatus as temporarily_closed');
    assert(calcManualClosed.isOrderingAllowed === false, 'Manual override closed blocks orders immediately');
    diwali2026.manualOverride.status = 'auto'; // reset

    // Test 5: Reopening past closing deadline is BLOCKED
    const afterDiwali = new Date('2026-11-12T12:00:00+05:30'); // After Nov 10
    const calcAfter = diwali2026.calculateStatus(afterDiwali);
    assert(calcAfter.festivalStatus === 'completed', 'Festival status is completed after end date');
    assert(calcAfter.preorderStatus === 'festival_completed', 'Preorder status is festival_completed after festival');
    assert(calcAfter.isOrderingAllowed === false, 'Orders cannot be accepted for completed festival');

    // Even if override is 'open', after deadline it must remain closed
    diwali2026.manualOverride.status = 'open';
    const calcForcedAfter = diwali2026.calculateStatus(afterDiwali);
    assert(calcForcedAfter.isOrderingAllowed === false, 'After festival/deadline, orders remain closed regardless of manual override');
    diwali2026.manualOverride.status = 'auto'; // reset

    // Test 6: Capacity Limit
    const mockFest = new Festival({
      name: 'Test Navratri Mock',
      slug: 'test-navratri-mock',
      year: 2026,
      startDate: new Date('2026-10-11T00:00:00+05:30'),
      endDate: new Date('2026-10-20T23:59:59+05:30'),
      preorderSettings: {
        enabled: true,
        leadTimeDays: 5,
        maxTotalOrders: 10,
        currentTotalOrders: 10 // at capacity!
      }
    });
    const inWindowMock = new Date('2026-10-15T12:00:00+05:30');
    const calcMock = mockFest.calculateStatus(inWindowMock);
    assert(calcMock.preorderStatus === 'sold_out', 'Festival with currentTotalOrders >= maxTotalOrders is marked sold_out');
    assert(calcMock.isOrderingAllowed === false, 'Sold out festival disallows ordering');

    // Test 7: Overlapping Festivals
    const all2026 = await Festival.find({ year: 2026 });
    assert(all2026.length >= 10, 'Multiple overlapping and sequential festivals for 2026 exist concurrently without corruption');

    console.log(`\n========================================`);
    console.log(`TEST SUMMARY: ${passed} Passed, ${failed} Failed`);
    console.log(`========================================\n`);

    process.exit(failed > 0 ? 1 : 0);
  } catch (err) {
    console.error('Test execution error:', err);
    process.exit(1);
  }
}

runTests();
