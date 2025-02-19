const Section = require("../../models/User/Section");
const User = require("../../models/User/User");
const StudentProfile = require("../../models/User/StudentProfile");
const AppError = require("../../utilities/appError");
const catchAsync = require("../../utilities/catchAsync");
const crypto = require("crypto");

const generateCode = (length) => {
  // Generate Verification Token
  return crypto.randomBytes(length / 2).toString("hex");
};

// Get Section by Id
const section_get = catchAsync(async (req, res, next) => {
  const { id, code } = req.query;

  if (!id && !code)
    return next(new AppError("Section identifier not found.", 400));

  let section;
  if (id) {
    section = await Section.findById(id)
      .populate({
        path: "students",
        populate: {
          path: "studentProfile",
        },
      })
      .populate("subjects");
  } else if (code) {
    section = await Section.findOne({ sectionCode: code.toLowerCase() })
      .populate({
        path: "students",
        populate: {
          path: "studentProfile",
        },
      })
      .populate("subjects");

    console.log(section);
  }

  if (!section)
    return next(
      new AppError(
        "Section not found. Invalid Section ID or Section Code.",
        404
      )
    );

  return res.status(200).json(section);
});

// Create Section
const section_post = catchAsync(async (req, res, next) => {
  const { userId } = req.query;
  const isUserValid = await User.findById(userId);

  if (!isUserValid)
    return next(new AppError("User not found. Invalid User ID.", 404));

  req.body.sectionCode = generateCode(6);

  const newSection = await Section.create({
    ...req.body,
    students: [userId],
  });

  // Create new Student Profile
  const newStudentProfile = await StudentProfile.create({
    role: "president",
    status: "regular",
    section: newSection._id,
    user: userId,
  });

  // Update User with Student Profile
  await User.findByIdAndUpdate(userId, {
    studentProfile: newStudentProfile._id,
  });

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

// Section Enroll
const section_enroll = catchAsync(async (req, res, next) => {
  const { id, sectionCode, enroll, unenroll } = req.query;
  const { userId } = req.body;

  const isUserValid = await User.findById(userId).populate("studentProfile");

  if (!isUserValid)
    return next(new AppError("User not found. Invalid User ID.", 404));

  if (!sectionCode && !id)
    return next(
      new AppError(
        "Section identifier not found. Invalid Request Parameters.",
        400
      )
    );
  if (!enroll && !unenroll)
    return next(new AppError("Invalid Request Parameters.", 400));
  if (!userId)
    return next(
      new AppError("User ID not found. Invalid Request Parameters.", 400)
    );

  let section;

  if (id) {
    section = await Section.findById(id);
  } else {
    section = await Section.findOne({
      sectionCode: sectionCode.toLowerCase(),
    });
  }

  if (!section)
    return next(new AppError("Section not found. Invalid Section Code.", 404));

  let updatedSection;

  if (enroll) {
    // Check Enrollment
    if (
      isUserValid.studentProfile &&
      isUserValid.studentProfile.section.toString() === section._id.toString()
    ) {
      return next(new AppError("User already enrolled in this section.", 400));
    }

    // Create new Student Profile
    let newStudentProfile;
    if (!isUserValid.studentProfile) {
      newStudentProfile = await StudentProfile.create({
        role: "student",
        status: "regular",
        section: section._id,
        user: userId,
      });
    } else {
      // Update Student Profile
      newStudentProfile = await StudentProfile.findByIdAndUpdate(
        isUserValid.studentProfile._id,
        {
          section: section._id,
          role: "student",
        }
      );
    }

    // Update User with Student Profile
    await User.findByIdAndUpdate(userId, {
      studentProfile: newStudentProfile._id,
    });

    // Enrollment
    updatedSection = await Section.findByIdAndUpdate(
      section._id,
      { $push: { students: userId } },
      { new: true }
    );
  } else {
    // Check Enrollment
    if (!isUserValid.studentProfile) {
      return next(
        new AppError("User is currently not enrolled in this section.", 400)
      );
    }

    if (
      isUserValid.studentProfile &&
      isUserValid.studentProfile.section.toString() !== section._id.toString()
    ) {
      return next(
        new AppError("User is currently not enrolled in this section.", 400)
      );
    }

    // Delete Student Profile
    await StudentProfile.findByIdAndDelete(isUserValid.studentProfile._id);

    // Remove Student Profile from User
    await User.findByIdAndUpdate(userId, { studentProfile: null });

    // Unenrollment
    updatedSection = await Section.findByIdAndUpdate(
      section._id,
      { $pull: { students: userId } },
      { new: true }
    );
  }

  if (!updatedSection) {
    return next(
      new AppError("Section not found. Section Update Not Successful.", 404)
    );
  }

  return res
    .status(200)
    .json({ message: "Section Updated Successfully", updatedSection });
});

module.exports = {
  section_get,
  section_post,
  section_put,
  section_enroll,
  section_delete,
};
