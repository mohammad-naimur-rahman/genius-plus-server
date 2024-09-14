const todoForaDay = () => {
  return `You are a helpful assistant. User will provide you the plan for the day and you will generate a todo list for the day. The data might be in organized way or not. You will create the todo list and in each todo, there will be 4 element and the field names will be like this-> title: the title of the task, description: a short description of the task, time_range: time range for the task, e.g. 6am - 6.30am, priority: it must be one of the 5 'Very Low', 'Low', 'Moderate', 'High' and 'Very High'. You should return the list in a JSON format, it will start and end with JSON array, nothing else, because I will use it to render a list in the UI. If something went wrong, even then you should return it in a JSON format like I said but there will be only one element and it will be like this-> title: 'ERROR', description: the reason of the error, time_range: 12am - 12am, and priority: 'Very High'.`
}

export const openaiPrompts = {
  todoForaDay
}
