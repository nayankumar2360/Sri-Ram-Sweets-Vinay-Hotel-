const Festival = require('../models/Festival');
const Product = require('../models/Product');
const seedFestivalsScript = require('../seed/seedFestivals');

// Helper to generate a URL-safe slug
const generateSlug = (name, year) => {
  const base = `${name} ${year || new Date().getFullYear()}`
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
  return base;
};

// ================= PUBLIC ENDPOINTS =================

/**
 * @desc Get all festivals with computed dynamic status
 * @route GET /api/festivals
 * @access Public
 */
exports.getFestivals = async (req, res, next) => {
  try {
    const { year, region, status, search, includeCompleted } = req.query;
    const filter = {};

    // By default, only active festivals for public unless specified
    if (req.query.active !== undefined) {
      filter.isActive = req.query.active === 'true';
    } else {
      filter.isActive = true;
    }

    if (year) filter.year = Number(year);
    if (region) filter.region = region;
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    const festivals = await Festival.find(filter)
      .populate('products')
      .sort({ startDate: 1 });

    const now = new Date();
    const result = festivals.map(fest => {
      const calculated = fest.calculateStatus(now);
      return {
        ...fest.toObject(),
        ...calculated
      };
    }).filter(f => {
      if (status) {
        if (status === 'upcoming') return f.festivalStatus === 'upcoming';
        if (status === 'ongoing') return f.festivalStatus === 'ongoing';
        if (status === 'completed') return f.festivalStatus === 'completed';
        if (status === 'open') return f.preorderStatus === 'open';
      }
      if (includeCompleted === 'false' && f.festivalStatus === 'completed') {
        return false;
      }
      return true;
    });

    res.status(200).json({
      success: true,
      count: result.length,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get currently featured / active live festival banner for Hero section
 * @route GET /api/festivals/live
 * @access Public
 */
exports.getLiveBanner = async (req, res, next) => {
  try {
    const now = new Date();
    const currentTime = now.getTime();

    // Find all active festivals with banner enabled
    const eligibleFestivals = await Festival.find({
      isActive: true,
      'banner.enabled': true
    }).populate('products');

    if (!eligibleFestivals.length) {
      return res.status(200).json({
        success: true,
        data: null,
        message: 'No active festival banners configured'
      });
    }

    // Compute status for all eligible festivals
    const evaluated = eligibleFestivals.map(fest => {
      const calculated = fest.calculateStatus(now);
      return {
        festival: fest,
        calculated
      };
    });

    // Filter out completed festivals unless banner displayEndDate extends beyond festival end
    const activeOrUpcoming = evaluated.filter(item => {
      const fest = item.festival;
      if (fest.banner?.displayEndDate) {
        return new Date(fest.banner.displayEndDate).getTime() >= currentTime;
      }
      return item.calculated.festivalStatus !== 'completed';
    });

    if (!activeOrUpcoming.length) {
      return res.status(200).json({
        success: true,
        data: null,
        message: 'No upcoming or active festival banners'
      });
    }

    // Priority 1: An explicitly featured festival among active/upcoming
    let selected = activeOrUpcoming.find(item => item.festival.isFeatured);

    // Priority 2: Currently ongoing festival
    if (!selected) {
      selected = activeOrUpcoming.find(item => item.calculated.festivalStatus === 'ongoing');
    }

    // Priority 3: Earliest upcoming festival
    if (!selected) {
      const upcomingList = activeOrUpcoming
        .filter(item => item.calculated.festivalStatus === 'upcoming')
        .sort((a, b) => new Date(a.festival.startDate) - new Date(b.festival.startDate));
      selected = upcomingList[0];
    }

    if (!selected) {
      selected = activeOrUpcoming[0];
    }

    const payload = {
      ...selected.festival.toObject(),
      ...selected.calculated
    };

    res.status(200).json({
      success: true,
      data: payload
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get festival by slug or ObjectId
 * @route GET /api/festivals/:slugOrId
 * @access Public
 */
exports.getFestivalBySlugOrId = async (req, res, next) => {
  try {
    const { slugOrId } = req.params;
    let festival;

    if (slugOrId.match(/^[0-9a-fA-F]{24}$/)) {
      festival = await Festival.findById(slugOrId).populate('products');
    }
    if (!festival) {
      festival = await Festival.findOne({ slug: slugOrId.toLowerCase() }).populate('products');
    }

    if (!festival) {
      return res.status(404).json({
        success: false,
        message: 'Festival not found'
      });
    }

    const calculated = festival.calculateStatus(new Date());

    res.status(200).json({
      success: true,
      data: {
        ...festival.toObject(),
        ...calculated
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get products for a specific festival
 * @route GET /api/festivals/:slugOrId/products
 * @access Public
 */
exports.getFestivalProducts = async (req, res, next) => {
  try {
    const { slugOrId } = req.params;
    let festival;

    if (slugOrId.match(/^[0-9a-fA-F]{24}$/)) {
      festival = await Festival.findById(slugOrId).populate('products');
    }
    if (!festival) {
      festival = await Festival.findOne({ slug: slugOrId.toLowerCase() }).populate('products');
    }

    if (!festival) {
      return res.status(404).json({
        success: false,
        message: 'Festival not found'
      });
    }

    let products = festival.products || [];
    // If festival does not have explicit products, fallback to all preorderEnabled products
    if (products.length === 0) {
      products = await Product.find({ preorderEnabled: true, isAvailable: true });
    }

    res.status(200).json({
      success: true,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// ================= PROTECTED OWNER ENDPOINTS =================

/**
 * @desc Create new festival
 * @route POST /api/festivals
 * @access Owner
 */
exports.createFestival = async (req, res, next) => {
  try {
    const body = { ...req.body };

    // Parse JSON fields if multipart form data was submitted
    if (typeof body.importantDays === 'string') {
      try { body.importantDays = JSON.parse(body.importantDays); } catch (e) {}
    }
    if (typeof body.banner === 'string') {
      try { body.banner = JSON.parse(body.banner); } catch (e) {}
    }
    if (typeof body.preorderSettings === 'string') {
      try { body.preorderSettings = JSON.parse(body.preorderSettings); } catch (e) {}
    }
    if (typeof body.products === 'string') {
      try { body.products = JSON.parse(body.products); } catch (e) {}
    }

    if (!body.name) {
      return res.status(400).json({ success: false, message: 'Festival name is required' });
    }
    if (!body.startDate || !body.endDate) {
      return res.status(400).json({ success: false, message: 'Start and end dates are required' });
    }

    const year = body.year || new Date(body.startDate).getFullYear();
    body.year = year;

    if (!body.slug) {
      body.slug = generateSlug(body.name, year);
    } else {
      body.slug = body.slug.toLowerCase().trim();
    }

    // Check slug uniqueness
    const existing = await Festival.findOne({ slug: body.slug });
    if (existing) {
      body.slug = `${body.slug}-${Date.now().toString().slice(-4)}`;
    }

    // Handle uploaded banner images if provided
    if (req.files) {
      body.banner = body.banner || {};
      if (req.files.desktopImage && req.files.desktopImage[0]) {
        body.banner.desktopImage = `/uploads/festivals/${req.files.desktopImage[0].filename}`;
      }
      if (req.files.mobileImage && req.files.mobileImage[0]) {
        body.banner.mobileImage = `/uploads/festivals/${req.files.mobileImage[0].filename}`;
      }
      if (req.files.image && req.files.image[0]) {
        body.banner.desktopImage = `/uploads/festivals/${req.files.image[0].filename}`;
      }
    }

    // If marked featured, remove featured from others
    if (body.isFeatured) {
      await Festival.updateMany({ _id: { $ne: null } }, { isFeatured: false });
    }

    const festival = await Festival.create(body);

    res.status(201).json({
      success: true,
      data: festival
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Update festival
 * @route PUT /api/festivals/:id
 * @access Owner
 */
exports.updateFestival = async (req, res, next) => {
  try {
    const festival = await Festival.findById(req.params.id);
    if (!festival) {
      return res.status(404).json({ success: false, message: 'Festival not found' });
    }

    const body = { ...req.body };

    // Parse JSON fields if multipart form
    if (typeof body.importantDays === 'string') {
      try { body.importantDays = JSON.parse(body.importantDays); } catch (e) {}
    }
    if (typeof body.banner === 'string') {
      try { body.banner = JSON.parse(body.banner); } catch (e) {}
    }
    if (typeof body.preorderSettings === 'string') {
      try { body.preorderSettings = JSON.parse(body.preorderSettings); } catch (e) {}
    }
    if (typeof body.manualOverride === 'string') {
      try { body.manualOverride = JSON.parse(body.manualOverride); } catch (e) {}
    }
    if (typeof body.products === 'string') {
      try { body.products = JSON.parse(body.products); } catch (e) {}
    }

    // Handle uploaded banner images if provided
    if (req.files) {
      body.banner = body.banner || (festival.banner ? festival.banner.toObject() : {});
      if (req.files.desktopImage && req.files.desktopImage[0]) {
        body.banner.desktopImage = `/uploads/festivals/${req.files.desktopImage[0].filename}`;
      }
      if (req.files.mobileImage && req.files.mobileImage[0]) {
        body.banner.mobileImage = `/uploads/festivals/${req.files.mobileImage[0].filename}`;
      }
      if (req.files.image && req.files.image[0]) {
        body.banner.desktopImage = `/uploads/festivals/${req.files.image[0].filename}`;
      }
    }

    // If marked featured, remove featured from other festivals
    if (body.isFeatured && !festival.isFeatured) {
      await Festival.updateMany({ _id: { $ne: festival._id } }, { isFeatured: false });
    }

    const updated = await Festival.findByIdAndUpdate(
      req.params.id,
      { $set: body },
      { new: true, runValidators: true }
    ).populate('products');

    const calculated = updated.calculateStatus(new Date());

    res.status(200).json({
      success: true,
      data: {
        ...updated.toObject(),
        ...calculated
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Manual Preorder Control: Open, Close, or Reset to Auto
 * @route PATCH /api/festivals/:id/preorders
 * @access Owner
 */
exports.updatePreorderControl = async (req, res, next) => {
  try {
    const festival = await Festival.findById(req.params.id);
    if (!festival) {
      return res.status(404).json({ success: false, message: 'Festival not found' });
    }

    const { status, reason, leadTimeDays, customOpenDate, customCloseDeadline, maxTotalOrders } = req.body;
    const now = new Date();

    // Calculate current boundary deadlines
    const calculated = festival.calculateStatus(now);

    // Rule enforcement:
    // If attempting to reopen (status === 'open'), verify festival is within eligible preorder window
    if (status === 'open') {
      if (calculated.festivalStatus === 'completed') {
        return res.status(400).json({
          success: false,
          message: 'Cannot reopen preorders for a completed festival'
        });
      }
      if (now.getTime() > calculated.closeDeadline.getTime()) {
        return res.status(400).json({
          success: false,
          message: 'Cannot reopen preorders after the configured closing deadline has passed'
        });
      }
    }

    // Apply manual override updates
    if (status !== undefined) {
      if (!['auto', 'open', 'closed'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Status must be one of: auto, open, closed'
        });
      }
      festival.manualOverride.status = status;
      festival.manualOverride.reason = reason !== undefined ? reason : festival.manualOverride.reason;
      festival.manualOverride.updatedAt = now;
      festival.manualOverride.updatedBy = req.user._id;
    }

    // Apply window configuration updates if provided
    if (leadTimeDays !== undefined) festival.preorderSettings.leadTimeDays = Number(leadTimeDays);
    if (customOpenDate !== undefined) festival.preorderSettings.customOpenDate = customOpenDate ? new Date(customOpenDate) : null;
    if (customCloseDeadline !== undefined) festival.preorderSettings.customCloseDeadline = customCloseDeadline ? new Date(customCloseDeadline) : null;
    if (maxTotalOrders !== undefined) festival.preorderSettings.maxTotalOrders = Number(maxTotalOrders);

    await festival.save();

    const newCalculated = festival.calculateStatus(now);

    res.status(200).json({
      success: true,
      message: `Preorder status updated to ${status || 'updated'} successfully`,
      data: {
        ...festival.toObject(),
        ...newCalculated
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Update Festival Banner
 * @route PATCH /api/festivals/:id/banner
 * @access Owner
 */
exports.updateBanner = async (req, res, next) => {
  try {
    const festival = await Festival.findById(req.params.id);
    if (!festival) {
      return res.status(404).json({ success: false, message: 'Festival not found' });
    }

    const {
      headline,
      subtitle,
      ctaText,
      ctaLink,
      desktopImage,
      mobileImage,
      overlayOpacity,
      focalPoint,
      enabled,
      isFeatured
    } = req.body;

    if (headline !== undefined) festival.banner.headline = headline;
    if (subtitle !== undefined) festival.banner.subtitle = subtitle;
    if (ctaText !== undefined) festival.banner.ctaText = ctaText;
    if (ctaLink !== undefined) festival.banner.ctaLink = ctaLink;
    if (desktopImage !== undefined) festival.banner.desktopImage = desktopImage;
    if (mobileImage !== undefined) festival.banner.mobileImage = mobileImage;
    if (overlayOpacity !== undefined) festival.banner.overlayOpacity = Number(overlayOpacity);
    if (focalPoint !== undefined) festival.banner.focalPoint = focalPoint;
    if (enabled !== undefined) festival.banner.enabled = enabled;

    // Handle files if uploaded
    if (req.files) {
      if (req.files.desktopImage && req.files.desktopImage[0]) {
        festival.banner.desktopImage = `/uploads/festivals/${req.files.desktopImage[0].filename}`;
      }
      if (req.files.mobileImage && req.files.mobileImage[0]) {
        festival.banner.mobileImage = `/uploads/festivals/${req.files.mobileImage[0].filename}`;
      }
      if (req.files.image && req.files.image[0]) {
        festival.banner.desktopImage = `/uploads/festivals/${req.files.image[0].filename}`;
      }
    }

    if (isFeatured !== undefined) {
      if (isFeatured) {
        await Festival.updateMany({ _id: { $ne: festival._id } }, { isFeatured: false });
      }
      festival.isFeatured = isFeatured;
    }

    await festival.save();

    res.status(200).json({
      success: true,
      data: festival
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Update Festival Capacity
 * @route PATCH /api/festivals/:id/capacity
 * @access Owner
 */
exports.updateCapacity = async (req, res, next) => {
  try {
    const { maxTotalOrders, resetCurrentOrders } = req.body;
    const update = {};

    if (maxTotalOrders !== undefined) {
      update['preorderSettings.maxTotalOrders'] = Number(maxTotalOrders);
    }
    if (resetCurrentOrders) {
      update['preorderSettings.currentTotalOrders'] = 0;
    }

    const festival = await Festival.findByIdAndUpdate(
      req.params.id,
      { $set: update },
      { new: true }
    );

    if (!festival) {
      return res.status(404).json({ success: false, message: 'Festival not found' });
    }

    const calculated = festival.calculateStatus(new Date());

    res.status(200).json({
      success: true,
      data: {
        ...festival.toObject(),
        ...calculated
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Delete or deactivate a festival
 * @route DELETE /api/festivals/:id
 * @access Owner
 */
exports.deleteFestival = async (req, res, next) => {
  try {
    const festival = await Festival.findById(req.params.id);
    if (!festival) {
      return res.status(404).json({ success: false, message: 'Festival not found' });
    }

    // Hard delete
    await Festival.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Festival deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Execute Idempotent Festival Seeding
 * @route POST /api/festivals/seed
 * @access Owner
 */
exports.seedFestivals = async (req, res, next) => {
  try {
    const stats = await seedFestivalsScript();
    res.status(200).json({
      success: true,
      message: 'Festival database seeded successfully',
      stats
    });
  } catch (error) {
    next(error);
  }
};
