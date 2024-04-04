// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id
function generateTaskId() {
    if (nextId === null) {
        nextId = 1;
    } else {
        nextId ++;
    }
    localStorage.setItem('nextId', JSON.stringify(nextId));
    return nextId;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    const taskCard = $('<div>')
        .addClass('card draggable w-75 my-3 task-card')
        .attr('data-task-id', task.id);

        const cardHeader = $('<div>')
        .addClass('card-header h4')
        .text(task.title);

        const cardBody = $('<div>')
        .addClass('card-body');

        const cardDescription = $('<p>')
        .addClass('card-text')
        .text(task.description);

        const cardDD = $('<p>')
        .addClass('card-text')
        .text(task.dueDate);

        const cardDelete = $('<button>')
        .addClass('btn btn-danger delete')
        .text('Delete')
        .attr('data-task-id', task.id);
        cardDelete.on('click', handleDeleteTask)

        if (task.dueDate && task.status !== 'done') {
            const now = dayjs();
            const taskDueDate = dayjs(task.dueDate, 'DD/MM/YYYY');
            if (now.isSame(taskDueDate, 'day')) {
                taskCard.addClass('bg-warning text-white')
            } else if (now.isAfter(taskDueDate)) {
                taskCard.addClass('bg-danger text-white');
                cardDelete.addClass('border-light')
        }
}
    cardBody.append(cardDescription, cardDD, cardDelete);
    taskCard.append(cardHeader, cardBody);

    return taskCard;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    if (taskList === null) {
        taskList = [];
    }

    const todoList = $('#todo-cards');
    todoList.empty();

    const inProgressList = $('#in-progress-cards');
    inProgressList.empty();

    const doneList = $('#done-cards');
    doneList.empty();

    for (let index = 0; index < taskList.length; index++) {
        if (taskList[index].status === 'to-do') {
            todoList.append(createTaskCard(taskList[index]));
        } else if (taskList[index].status === 'in-progress') {
            inProgressList.append(createTaskCard(taskList[index]));
        } else if (taskList[index].status === 'done') {
            doneList.append(createTaskCard(taskList[index]));
        }
    }

    $('.draggable').draggable({
        opacity: 0.75,
        zIndex: 10,

        helper: function (event) {
            let origCard;
            if ($(event.target).hasClass('ui-draggable')) {
                origCard = $(event.target);
            } else {
                origCard = $(event.target).closest('.ui-draggable')
            }

            return origCard.clone().css({
                maxWidth: origCard.outerWidth(),
            });
        }
    })
}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    event.preventDefault();

    const task = {
        id: generateTaskId(),
        title: $('#task-title').val(),
        dueDate: $('#task-dd').val(),
        description: $('#task-description').val(),
        status: 'to-do',
    }

    taskList.push(task);
    localStorage.setItem('tasks', JSON.stringify(taskList))
    renderTaskList();
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
    event.preventDefault();

        const taskId = $(this).attr("data-task-id");
        //CHANGE TO FOR LOOP//
        for (let i = 0; i < taskList.length; i++) {
            if (taskList[i].id !== parseInt(taskId)) {
            } else {
            taskList.splice(i, 1); 
            i--; 
    }
}
        localStorage.setItem('tasks', JSON.stringify(taskList));
        renderTaskList();

}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
  
    
    const taskId = $(ui.draggable).data("task-id"); 
    console.log("taskId:", taskId);
    
    const newStatus = event.target.id;
    console.log("newStatus:", newStatus);

    for (let index = 0; index < taskList.length; index++) {
        if (taskList[index].id == taskId) {
            taskList[index].status = newStatus;
        }
    }

    localStorage.setItem('tasks', JSON.stringify(taskList));
    renderTaskList();
}

// Todo: when the page loads, render the task list, add event listeners, 
// make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList();

    $('#task-form').on('submit', handleAddTask);
    
    $('.lane').droppable({
        accept: ".draggable",
        drop: handleDrop
    })
});

