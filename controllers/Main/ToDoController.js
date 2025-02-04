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
  )
    return next(new AppError("No data to update", 400));

  const toDo = await ToDo.findById(id)
    .populate("assignedUsers")
    .populate("submittedUsers");

  if (!toDo)
    return next(new AppError("To Do not found. Invalid To Do ID.", 404));

  let newToDoName,
    newDescription,
    newDeadline,
    updates = {
      assignedUsers: [],
      submittedUsers: [],
    };

  if (toDoName) newToDoName = toDoName;
  if (description) newDescription = description;
  if (deadline) newDeadline = deadline;

  if (assignedUsers) {
    updates.assignedUsers = assignedUsers.filter(
      (student) => !toDo.assignedUsers.some((s) => s._id.toString() === student)
    );
  }

  if (submittedUsers) {
    updates.submittedUsers = submittedUsers.filter(
      (student) =>
        !toDo.submittedUsers.some((s) => s._id.toString() === student)
    );
  }

  const updatedToDo = await ToDo.findByIdAndUpdate(
    id,
    {
      toDoName: newToDoName,
      description: newDescription,
      deadline: newDeadline,
      $push: {
        assignedUsers: { $each: updates.assignedUsers },
        submittedUsers: { $each: updates.submittedUsers },
      },
    },
    { new: true }
  );

  if (!updatedToDo) {
    return next(new AppError("To Do not found", 404));
  }

  return res
    .status(200)
    .json({ message: "To Do Updated Successfully", updatedToDo });
});

// Delete ToDo
const toDo_delete = catchAsync(async (req, res, next) => {
  const { id } = req.query;

  if (!id) return next(new AppError("To Do identifier not found", 400));

  const deletedToDo = await ToDo.findByIdAndDelete(id);

  if (!deletedToDo) return next(new AppError("ToDo not found", 404));
  return res
    .status(200)
    .json({ message: "To Do Successfully Deleted", deletedToDo });
});

// create separate for pushing students in assigned users, submitted users

module.exports = {
  toDo_get,
  toDo_post,
  toDo_put,
  toDo_delete,
};
