const Section = require("../../models/User/Section");
const User = require("../../models/User/User");
const AppError = require("../../utilities/appError");
const catchAsync = require("../../utilities/catchAsync");

// Get Section by Id
const section_get = catchAsync(async (req, res, next) => {
  const { id } = req.query;

  if (!id) return next(new AppError("Section identifier not found", 400));

  const section = await Section.findById(id)
    .populate("students")
    .populate("subjects");

  if (!section)
    return next(new AppError("Section not found. Invalid Section ID.", 404));

  return res.status(200).json(section);
});

// Create Section
const section_post = catchAsync(async (req, res, next) => {
  const { userId } = req.query;

  const isUserValid = await User.findById(userId);

  if (!isUserValid)
    return next(new AppError("User not found. Invalid User ID.", 404));

  const newSection = new Section({
    ...req.body,
    students: [userId],
  });

  await newSection.save();

  return res
    .status(200)
    .json({ message: "Section Successfully Created", newSection });
});

// Update Section
const section_put = catchAsync(async (req, res, next) => {
  const { id } = req.query;
  const { sectionName, students, subjects } = req.body;

  if (!id) return next(new AppError("Section identifier not found", 400));
  if (!sectionName && !students && !subjects)
    return next(new AppError("No data to update", 400));

  const section = await Section.findById(id)
    .populate("students")
    .populate("subjects");

  if (!section)
    return next(new AppError("Section not found. Invalid Section ID.", 404));

  let newSectionName,
    updates = {
      students: [],
      subjects: [],
    };

  if (sectionName) newSectionName = sectionName;
  if (students) {
    updates.students = students.filter(
      (student) => !section.students.some((s) => s._id.toString() === student)
    );
  }
  if (subjects) {
    updates.subjects = subjects.filter(
      (subjects) => !section.subjects.some((s) => s._id.toString() === subjects)
    );
  }

  const updatedSection = await Section.findByIdAndUpdate(
    id,
    {
      sectionName: newSectionName,
      $push: {
        students: { $each: updates.students },
        subjects: { $each: updates.subjects },
      },
    },
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

  const deletedSection = await Section.findByIdAndDelete(id);

  if (!deletedSection) return next(new AppError("Section not found", 404));
  return res
    .status(200)
    .json({ message: "Section Successfully Deleted", deletedSection });
});

module.exports = {
  section_get,
  section_post,
  section_put,
  section_delete,
};
