const Subject = require("../../models/User/Subject");
const Section = require("../../models/User/Section");
const User = require("../../models/User/User");
const AppError = require("../../utilities/appError");
const catchAsync = require("../../utilities/catchAsync");

// Get Subject by Id
const subject_get = catchAsync(async (req, res, next) => {
  const { id } = req.query;

  if (!id) return next(new AppError("Subject identifier not found", 400));

  const subject = await Subject.findById(id)
    .populate("enrolledStudents")
    .populate("section");

  if (!subject)
    return next(new AppError("Subject not found. Invalid Subject ID.", 404));

  return res.status(200).json(subject);
});

// Create Subject
const subject_post = catchAsync(async (req, res, next) => {
  const { userId } = req.query;
  const { section } = req.body;

  const isUserValid = await User.findById(userId);

  if (!isUserValid)
    return next(new AppError("User not found. Invalid User ID.", 404));

  const isSectionValid = await Section.findById(section);

  if (!isSectionValid)
    return next(new AppError("Section not found. Invalid Section ID.", 404));

  const newSubject = new Subject({
    ...req.body,
    enrolledStudents: [userId],
  });

  await newSubject.save();

  return res
    .status(200)
    .json({ message: "Subject Successfully Created", newSubject });
});

// Update Subject
const subject_put = catchAsync(async (req, res, next) => {
  const { id } = req.query;
  const { subjectName, subjectColor, enrolledStudents } = req.body;

  if (!id) return next(new AppError("Subject identifier not found", 400));

  if (!subjectName && !subjectColor && !enrolledStudents)
    return next(new AppError("No data to update", 400));

  const subject = await Subject.findById(id).populate("enrolledStudents");

  if (!subject)
    return next(new AppError("Subject not found. Invalid Subject ID.", 404));

  let newSubjectName,
    newSubjectColor,
    updateEnrolledStudents = [];

  if (subjectName) newSubjectName = subjectName;
  if (subjectColor) newSubjectColor = subjectColor;

  if (enrolledStudents) {
    updateEnrolledStudents = enrolledStudents.filter(
      (student) =>
        !subject.enrolledStudents.some((s) => s._id.toString() === student)
    );
  }

  const updatedSubject = await Subject.findByIdAndUpdate(
    id,
    {
      subjectName: newSubjectName,
      subjectColor: newSubjectColor,
      $push: {
        enrolledStudents: { $each: updateEnrolledStudents },
      },
    },
    { new: true }
  );

  if (!updatedSubject) {
    return next(new AppError("Subject not found", 404));
  }

  return res
    .status(200)
    .json({ message: "Subject Updated Successfully", updatedSubject });
});

// Delete Subject
const subject_delete = catchAsync(async (req, res, next) => {
  const { id } = req.query;

  if (!id) return next(new AppError("Subject identifier not found", 400));

  const deletedSubject = await Subject.findByIdAndDelete(id);

  if (!deletedSubject) return next(new AppError("Subject not found", 404));
  return res
    .status(200)
    .json({ message: "Subject Successfully Deleted", deletedSubject });
});

module.exports = {
  subject_get,
  subject_post,
  subject_put,
  subject_delete,
};
