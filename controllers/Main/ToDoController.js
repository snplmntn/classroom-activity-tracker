const ToDo = require("../../models/Main/ToDo");
const Subject = require("../../models/User/Subject");
const User = require("../../models/User/User");
const AppError = require("../../utilities/appError");
const catchAsync = require("../../utilities/catchAsync");

// Get ToDo by Id
const toDo_get = catchAsync(async (req, res, next) => {
  const { id } = req.query;

  if (!id) return next(new AppError("To Do identifier not found", 400));

  const toDo = await ToDo.findById(id)
    .populate("assignedUsers")
    .populate("submittedUsers")
    .populate("subject");

  if (!toDo)
    return next(new AppError("To Do not found. Invalid To Do ID.", 404));

  return res.status(200).json(toDo);
});

// Get To Do by Id
const toDo_userGet = catchAsync(async (req, res, next) => {
  const { userId } = req.query;

  if (!userId) return next(new AppError("To Do identifier not found", 400));

  const toDo = await ToDo.find({ assignedUsers: userId })
    .populate("assignedUsers")
    .populate("submittedUsers")
    .populate("subject");

  if (!toDo)
    return next(new AppError("To Do not found. Invalid To Do ID.", 404));

  return res.status(200).json(toDo);
});

// Create ToDo
const toDo_post = catchAsync(async (req, res, next) => {
  const { userId } = req.query;
  const { subject } = req.body;

  const isUserValid = await User.findById(userId);

  if (!isUserValid)
    return next(new AppError("User not found. Invalid User ID.", 404));

  const isSubjectValid = await Subject.findById(subject);

  if (!isSubjectValid)
    return next(new AppError("Subject not found. Invalid Subject ID.", 404));

  const newToDo = new ToDo({
    ...req.body,
    assignedUsers: isSubjectValid.enrolledStudents,
  });

  await newToDo.save();

  return res
    .status(200)
    .json({ message: "To Do Successfully Created", newToDo });
});

// Update ToDo
const toDo_put = catchAsync(async (req, res, next) => {
  const { id } = req.query;
  const { toDoName, description, deadline, assignedUsers, submittedUsers } =
    req.body;

  if (!id) return next(new AppError("To Do identifier not found", 400));

  if (
    !toDoName &&
    !description &&
    !deadline &&
    !assignedUsers &&
    !submittedUsers
  ) {
    return next(new AppError("No data to update", 400));
  }

  const toDo = await ToDo.findById(id).populate("submittedUsers");

  if (!toDo) {
    return next(new AppError("To Do not found. Invalid To Do ID.", 404));
  }

  let updates = {};

  if (toDoName) updates.toDoName = toDoName;
  if (description) updates.description = description;
  if (deadline) updates.deadline = deadline;
  if (assignedUsers) updates.assignedUsers = assignedUsers;

  if (submittedUsers) {
    // Avoid adding duplicates
    const existingUserIds = new Set(
      toDo.submittedUsers.map((user) => user._id.toString())
    );
    const filteredSubmittedUsers = submittedUsers.filter(
      (userId) => !existingUserIds.has(userId)
    );

    if (filteredSubmittedUsers.length > 0) {
      updates.$push = { submittedUsers: { $each: filteredSubmittedUsers } };
    }
  }

  const updatedToDo = await ToDo.findByIdAndUpdate(id, updates, {
    new: true,
  });

  if (!updatedToDo) {
    return next(new AppError("To Do not found", 404));
  }

  return res
    .status(200)
    .json({ message: "To Do Updated Successfully", updatedToDo });
});

// Submit ToDo
const toDo_submit = catchAsync(async (req, res, next) => {
  const { id, submit, unsubmit } = req.query;
  const { userId } = req.body;

  if (!id) return next(new AppError("To Do identifier not found", 400));

  if (!submit && !unsubmit) {
    return next(new AppError("Invalid request parameters", 400));
  } else if (!userId) return next(new AppError("User ID not Found.", 400));

  const toDo = await ToDo.findById(id).populate("submittedUsers");

  if (!toDo) {
    return next(new AppError("To Do not found. Invalid To Do ID.", 404));
  }

  let updatedToDo;

  if (submit) {
    updatedToDo = await ToDo.findByIdAndUpdate(
      id,
      { $push: { submittedUsers: userId } },
      { new: true }
    );
  } else {
    updatedToDo = await ToDo.findByIdAndUpdate(
      id,
      { $pull: { submittedUsers: userId } },
      { new: true }
    );
  }

  if (!updatedToDo) {
    return next(new AppError("To Do not found", 404));
  }

  return res.status(200).json({
    message: `To Do ${submit ? "submitted" : "unsubmitted"} Successfully`,
    updatedToDo,
  });
});

// Delete ToDo
const toDo_delete = catchAsync(async (req, res, next) => {
  const { id } = req.query;

  if (!id) return next(new AppError("To Do identifier not found", 400));

  const deletedToDo = await ToDo.findByIdAndDelete(id);

  if (!deletedToDo) return next(new AppError("To Do not found", 404));
  return res
    .status(200)
    .json({ message: "To Do Successfully Deleted", deletedToDo });
});

module.exports = {
  toDo_get,
  toDo_userGet,
  toDo_post,
  toDo_put,
  toDo_submit,
  toDo_delete,
};
