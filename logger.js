const logger = (message, context = {}) => {
  const logs = JSON.parse(localStorage.getItem("logs")) || [];
  logs.push({
    timestamp: new Date().toISOString(),
    message,
    context
  });
  localStorage.setItem("logs", JSON.stringify(logs));
};

export default logger;
