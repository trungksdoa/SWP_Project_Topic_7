import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Divider } from "antd";
import dayjs from "dayjs";
import {
  DatePicker,
  Select,
  Input,
  Pagination,
  Form,
  Button,
  Modal,
  Checkbox,
} from "antd";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import {
  useCompleteTask,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
  useGetAllTasks,
  useUpdateTaskIndex,
  useUncompleteTask,
} from "../../../hooks/user/useTodo";

const TodoManage = () => {
  const userLogin = useSelector((state) => state.manageUser.userLogin);
  const userId = userLogin?.id;
  const [editingTask, setEditingTask] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [searchDate, setSearchDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [localTasks, setLocalTasks] = useState([]);
  const [editTaskData, setEditTaskData] = useState({
    title: "",
    taskType: "",
    priority: "",
    dueDate: null,
    status: "",
    description: "",
  });
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [expandedTasks, setExpandedTasks] = useState([]);

  const { data: tasks, refetch: refetchTasks } = useGetAllTasks();
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();
  const completeTaskMutation = useCompleteTask();
  const updateTaskIndexMutation = useUpdateTaskIndex();
  const uncompleteTaskMutation = useUncompleteTask();
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [isAddingTask, setIsAddingTask] = useState(false);

  useEffect(() => {
    if (tasks) {
      setLocalTasks(tasks);
    }
  }, [tasks]);

  useEffect(() => {
    if (editTaskData && isEditModalVisible) {
      editForm.setFieldsValue({
        title: editTaskData.title,
        taskType: editTaskData.taskType,
        priority: editTaskData.priority,
        dueDate: editTaskData.dueDate,
        description: editTaskData.description,
      });
    }
  }, [editTaskData, isEditModalVisible, editForm]);

  const handleSubmit = async (values) => {
    if (!values) return;

    if (values.taskType === "TODO") {
      toast.error("Task type cannot be TODO");
      return;
    }

    setIsAddingTask(true);
    try {
      const taskData = {
        title: values.title,
        taskType: values.taskType || "TODO",
        priority: values.priority || "MEDIUM",
        dueDate: values.dueDate
          ? dayjs(values.dueDate).format("YYYY-MM-DDTHH:mm:ss")
          : dayjs().format("YYYY-MM-DDTHH:mm:ss"),
        description: values.description || "", // Changed to empty string if undefined
        userId: userId,
      };

      await createTaskMutation.mutateAsync(taskData, {
        onSuccess: () => {
          toast.success("Task added successfully");
          form.resetFields();
          refetchTasks();
        },
      });
    } catch (err) {
      toast.error("Error adding task", err);
    } finally {
      setIsAddingTask(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const values = await editForm.validateFields();
      const taskData = {
        title: values.title,
        taskType: values.taskType,
        priority: values.priority,
        dueDate: values.dueDate
          ? dayjs(values.dueDate).format("YYYY-MM-DDTHH:mm:ss")
          : dayjs().format("YYYY-MM-DDTHH:mm:ss"),
        description: values.description || "", // Changed to empty string if undefined
        status: editTaskData.status,
        userId: userId,
      };

      await updateTaskMutation.mutateAsync(
        { id: editingTask, payload: taskData },
        {
          onSuccess: () => {
            setEditingTask(null);
            setEditTaskData({
              title: "",
              taskType: "",
              priority: "",
              dueDate: null,
              status: "",
              description: "",
            });
            setIsEditModalVisible(false);
            refetchTasks();
            toast.success("Task updated successfully");
          },
        }
      );
    } catch (error) {
      toast.error("Failed to update task");
    }
  };

  const handleDelete = async (id) => {
    try {
      setLocalTasks((prev) => prev.filter((task) => task.id !== id));

      await deleteTaskMutation.mutateAsync(id, {
        onSuccess: () => {
          refetchTasks();
          toast.success("Task deleted successfully");
        },
      });
    } catch (error) {
      refetchTasks();
      toast.error("Failed to delete task");
    }
  };
  
  const toggleUncomplete = async (id) => {
    try {
      if (editTaskData.status === "Completed") {
        setLocalTasks((prev) =>
          prev.map((task) =>
            task.id === id ? { ...task, status: "ongoing" } : task
          )
        );

        await uncompleteTaskMutation.mutateAsync(id, {
          onSuccess: () => {
            refetchTasks();
            toast.success("Task uncompleted");
          },
        });
      }
    } catch (error) {
      refetchTasks(); 
      toast.error("Failed to uncomplete task");
    }
  };

  const toggleComplete = async (id) => {
    try {
      if (editTaskData.status !== "Completed") {
        setLocalTasks((prev) =>
          prev.map((task) =>
            task.id === id ? { ...task, status: "Completed" } : task
          )
        );

        await completeTaskMutation.mutateAsync(id, {
          onSuccess: () => {
            refetchTasks();
            toast.success("Task completed");
          },
        });
      }
    } catch (error) {
      refetchTasks();
      toast.error("Failed to complete task");
    }
  };

  const toggleDescription = (taskId) => {
    setExpandedTasks((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    try {
      const items = Array.from(currentTasks || []);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);

      const startIndex = (currentPage - 1) * pageSize;
      const updatedItems = items.map((item, index) => ({
        ...item,
        placeIndex: startIndex + index + 1,
      }));

      setLocalTasks((prev) => {
        const newTasks = [...prev];
        const pageStartIndex = (currentPage - 1) * pageSize;
        newTasks.splice(pageStartIndex, pageSize, ...updatedItems);
        return newTasks;
      });

      const apiUpdatedItems = items.map((item, index) => ({
        id: item.id,
        title: item.title,
        placeIndex: startIndex + index + 1,
        status: item.status,
        dueDate: item.dueDate,
        taskType: item.taskType,
        priority: item.priority,
        description: item.description || "", // Changed to empty string if undefined
        userId: item.userId,
      }));

      await updateTaskIndexMutation.mutateAsync(apiUpdatedItems, {
        onSuccess: () => {
          refetchTasks();
          toast.success("Tasks reordered");
        },
      });
    } catch (error) {
      refetchTasks();
      toast.error("Failed to reorder tasks");
    }
  };

  const getDueDateStatus = (dueDate) => {
    if (!dueDate) return null;

    const today = dayjs();
    const due = dayjs(dueDate);
    const daysUntilDue = due.diff(today, "day");

    if (daysUntilDue < 0) return { color: "text-red-600", message: "Overdue!" };
    if (daysUntilDue <= 3)
      return { color: "text-orange-500", message: "Due soon!" };
    if (daysUntilDue <= 7)
      return { color: "text-yellow-500", message: "Upcoming" };
    return null;
  };

  const [sortBy, setSortBy] = useState("priority");

  const filteredTasks = Array.isArray(localTasks)
    ? localTasks
        .filter((task) => {
          const matchesText = task.title
            .toLowerCase()
            .includes(searchText.toLowerCase());
          const matchesDate =
            !searchDate || dayjs(task.dueDate).isSame(searchDate, "day");
          return matchesText && matchesDate;
        })
        .sort((a, b) => {
          if (sortBy === "priority") {
            const priorityOrder = { HIGH: 1, MEDIUM: 2, LOW: 3 };

            if (a.priority === "LOW" && b.priority === "LOW") {
              return a.placeIndex - b.placeIndex;
            }

            if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
              return priorityOrder[a.priority] - priorityOrder[b.priority];
            }

            return a.placeIndex - b.placeIndex;
          }
          return a.placeIndex - b.placeIndex;
        })
    : [];

  const totalTasks = filteredTasks.length;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentTasks = filteredTasks.slice(startIndex, endIndex);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-semibold mb-6 text-gray-800">
          Task Schedule Management
        </h1>

        {/* Add Task Form */}
        <div className="mb-8 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <Form
            form={form}
            onFinish={handleSubmit}
            layout="vertical"
            initialValues={{
              title: "",
              taskType: "TODO",
              priority: "MEDIUM",
              dueDate: dayjs(),
              description: "", // Changed to empty string
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item
                label="Task Title"
                name="title"
                rules={[{ required: true, message: "Please enter task title" }]}
              >
                <Input placeholder="Task title" className="rounded-md" />
              </Form.Item>

              <Form.Item
                label="Due Date"
                name="dueDate"
                rules={[{ required: true, message: "Please select due date" }]}
              >
                <DatePicker 
                  showTime 
                  className="w-full rounded-md" 
                  disabledDate={(current) => current && current < dayjs().startOf('day')}
                />
              </Form.Item>

              <Form.Item
                label="Priority Level"
                name="priority"
                rules={[
                  { required: true, message: "Please select priority level" },
                ]}
              >
                <Select placeholder="Priority">
                  <Select.Option value="HIGH">High</Select.Option>
                  <Select.Option value="MEDIUM">Medium</Select.Option>
                  <Select.Option value="LOW">Low</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Task Category"
                name="taskType"
                rules={[
                  { required: true, message: "Please select task category" },
                ]}
              >
                <Select placeholder="Task Type">
                  <Select.Option value="WATER_CHANGE">
                    Water Change
                  </Select.Option>
                  <Select.Option value="FEEDING">Feeding</Select.Option>
                  <Select.Option value="MAINTENANCE">Maintenance</Select.Option>
                  <Select.Option value="HEALTH_CHECK">
                    Health Check
                  </Select.Option>
                </Select>
              </Form.Item>

              {/* Add Description Field */}
              <Form.Item
                label="Description"
                name="description"
                rules={[
                  { required: true, message: "Please enter task description" },
                ]}
                className="md:col-span-2"
              >
                <Input.TextArea
                  placeholder="Enter task description"
                  rows={4}
                  name="description"
                  className="rounded-md"
                />
              </Form.Item>
            </div>

            <Button
              type="primary"
              htmlType="submit"
              loading={isAddingTask}
              className="w-full"
            >
              Add Task
            </Button>
          </Form>
        </div>

        {/* Task List */}
        <div className="mb-4">
          <div className="flex gap-4 mb-4">
            <Input
              placeholder="Search tasks..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="flex-1"
            />
            <div className="flex items-center gap-2">
              <DatePicker
                placeholder="Filter by date"
                value={searchDate}
                onChange={(date) => setSearchDate(date)}
                className="w-48"
              />
              {searchDate && (
                <Button onClick={() => setSearchDate(null)} size="small">
                  Clear Date
                </Button>
              )}
            </div>
            <Select
              value={sortBy}
              onChange={(value) => setSortBy(value)}
              className="w-48"
            >
              <Select.Option value="priority">Sort by Priority</Select.Option>
              <Select.Option value="index">Sort by Order</Select.Option>
            </Select>
          </div>

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="tasks">
              {(provided) => (
                <ul
                  className="space-y-3"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {currentTasks.map((task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={task.id.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="flex flex-col p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <span className="text-gray-500">
                                #{index + 1}
                              </span>
                              <input
                                type="checkbox"
                                checked={task.status === "Completed"}
                                disabled={task.status === "Completed"}
                                onChange={() => toggleComplete(task.id)}
                                className="h-5 w-5"
                              />
                            </div>

                            <div className="flex-1">
                              <div className="font-medium">{task.title}</div>
                              <div className="text-sm text-gray-500">
                                Due:{" "}
                                {dayjs(task.dueDate).format(
                                  "MMM D, YYYY HH:mm"
                                )}
                                {getDueDateStatus(task.dueDate)?.message && (
                                  <span
                                    className={`ml-2 ${
                                      getDueDateStatus(task.dueDate).color
                                    }`}
                                  >
                                    {getDueDateStatus(task.dueDate).message}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-2 mr-4">
                              <span
                                className={`px-2 py-1 text-xs font-medium rounded ${
                                  task.priority === "HIGH"
                                    ? "bg-red-100 text-red-800"
                                    : task.priority === "MEDIUM"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-green-100 text-green-800"
                                }`}
                              >
                                {task.priority}
                              </span>
                            </div>

                            <div className="flex gap-2">
                              <Button
                                onClick={() => toggleDescription(task.id)}
                              >
                                {expandedTasks.includes(task.id)
                                  ? "Hide Description"
                                  : "View Description"}
                              </Button>
                              <Button
                                onClick={() => {
                                  setEditingTask(task.id);
                                  setEditTaskData({
                                    title: task.title,
                                    taskType: task.taskType,
                                    priority: task.priority,
                                    dueDate: dayjs(task.dueDate),
                                    status: task.status,
                                    description: task.description,
                                  });
                                  setIsEditModalVisible(true);
                                }}
                              >
                                Edit
                              </Button>
                              <Button
                                danger
                                onClick={() => handleDelete(task.id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>

                          {/* Description Collapse */}
                          {expandedTasks.includes(task.id) && (
                            <div className="mt-3 pl-10 text-gray-600 bg-gray-50 p-3 rounded">
                              {task.description || "No description provided"}
                            </div>
                          )}
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </DragDropContext>
        </div>

        <Pagination
          current={currentPage}
          total={totalTasks}
          pageSize={pageSize}
          onChange={setCurrentPage}
          className="text-center"
        />

        {/* Edit Task Modal */}
        <Modal title="Edit Task" open={isEditModalVisible}>
          <Form form={editForm} layout="vertical" initialValues={editTaskData}>
            <Form.Item
              label="Task Title"
              name="title"
              rules={[{ required: true, message: "Please enter task title" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Due Date"
              name="dueDate"
              rules={[{ required: true, message: "Please select due date" }]}
            >
              <DatePicker showTime className="w-full" />
            </Form.Item>
            <Form.Item
              label="Priority Level"
              name="priority"
              rules={[
                { required: true, message: "Please select priority level" },
              ]}
            >
              <Select>
                <Select.Option value="HIGH">High</Select.Option>
                <Select.Option value="MEDIUM">Medium</Select.Option>
                <Select.Option value="LOW">Low</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="Task Category"
              name="taskType"
              rules={[
                { required: true, message: "Please select task category" },
              ]}
            >
              <Select>
                <Select.Option value="WATER_CHANGE">Water Change</Select.Option>
                <Select.Option value="FEEDING">Feeding</Select.Option>
                <Select.Option value="MAINTENANCE">Maintenance</Select.Option>
                <Select.Option value="HEALTH_CHECK">Health Check</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="Description" name="description">
              <Input.TextArea rows={4} name="description" />
            </Form.Item>
            <Divider />
            <Button
              key="cancel"
              onClick={() => {
                setIsEditModalVisible(false);
                setEditingTask(null);
                setEditTaskData({
                  title: "",
                  taskType: "",
                  priority: "",
                  dueDate: null,
                  status: "",
                  description: "",
                });
                editForm.resetFields();
              }}
            >
              Cancel
            </Button>
            ,
            <Button key="submit" type="primary" onClick={handleUpdate}>
              Save Changes
            </Button>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default TodoManage;
