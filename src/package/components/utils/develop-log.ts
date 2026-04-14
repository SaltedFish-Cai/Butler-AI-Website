const colors = {
  success: "#42b983",
  danger: "#f56c6c",
  info: "#9b9ea3",
  default: "#42b983",
  warning: "#e6a23c"
};

function createLog(env = "product") {
  const developLog = {
    log: (msg: number | string, id: number | string, type: string = "default") => {
      if (env !== "development") return;
      console.log(`%c(${type})   ${msg}: ${id}  `, `color: ${colors[type]}`);
    },
    json: (json: any, mgs: string, type: string = "default") => {
      if (env !== "development") return;
      console.log(" ");
      console.log(`%cJSON ${mgs}  `, `color: ${colors[type]}`);
      try {
        console.log(JSON.parse(JSON.stringify(json)));
      } catch (error) {
        console.log(json);
      }
    }
  };
  return developLog;
}

export { createLog };
