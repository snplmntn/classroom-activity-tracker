const Section = require("../../models/User/Section");
const AppError = require("../../utilities/appError");
const catchAsync = require("../../utilities/catchAsync");

// Get Section by Id
const section_get = catchAsync(async (req, res, next) => {
  const { id } = req.query;

  let section;
  if (id) {
    section = await Section.findOne({
      _id: req.query.id,
    }).populate("userId");
  } else {
    section = await Section.find().populate("userId");
  }

  if (!section) return next(new AppError("Section not found", 404));

  return res.status(200).json(section);
});

// Create Section
const section_post = catchAsync(async (req, res, next) => {
  const newSection = new Section(req.body);

  await newSection.save();

  return res
    .status(200)
    .json({ message: "Section Successfully Created", newSection });
});

// Update Section
const section_put = catchAsync(async (req, res, next) => {
  const { id } = req.query;

  if (!id) return next(new AppError("Section identifier not found", 400));

  const updatedSection = await Section.findByIdAndUpdate(
    id,
    { $set: req.body },
    { new: true }
  );

  if (!updatedSection) {
    return next(new AppError("Section not found", 404));
  }

  return res
    .status(200)
    .json({ message: "Section Updated Successfully", updatedSection });
});

// Delete Section
const section_delete = catchAsync(async (req, res, next) => {
  const { id } = req.query;

  if (!id) return next(new AppError("Section identifier not found", 400));

  const deletedSection = await Section.findByIdAndDelete(req.query.id);

  if (!deletedSection) return next(new AppError("Section not found", 404));
  return res
    .status(200)
    .json({ message: "Section Successfully Deleted", deletedSection });
});

module.exports = {
  section_get,
  section_post,
  section_user_get,
  section_put,
  section_delete,
};
