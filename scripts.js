// kwinjir kwa matrices
const matrixCanvas = document.createElement("canvas");
const ctx = matrixCanvas.getContext("2d");
document.getElementById("matrix").appendChild(matrixCanvas);

matrixCanvas.width = window.innerWidth;
matrixCanvas.height = window.innerHeight;

const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const fontSize = 16;
const columns = matrixCanvas.width / fontSize;
const drops = Array(Math.floor(columns)).fill(1);

function drawMatrix() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
  ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

  ctx.fillStyle = "#0f0";
  ctx.font = `${fontSize}px monospace`;

  for (let i = 0; i < drops.length; i++) {
    const text = chars[Math.floor(Math.random() * chars.length)];
    ctx.fillText(text, i * fontSize, drops[i] * fontSize);

    if (drops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i]++;
  }
}

setInterval(drawMatrix, 33); // umvuduko

// functionalty
const commandInput = document.getElementById("command");
const outputArea = document.getElementById("output");

// cmd  inputs
const fileSystem = {
  "/": ["home", "var", "etc"],
  "/home": ["user1", "user2"],
  "/home/user1": ["file1.txt", "file2.txt"],
  "/home/user2": ["file3.txt"],
  "/var": ["log"],
  "/etc": [],
};

let currentPath = "/home/user1";

const commands = {
  ls: () => {
    return fileSystem[currentPath]
      ? fileSystem[currentPath].join("\n")
      : "No such directory";
  },
  pwd: () => {
    return currentPath;
  },
  cat: (filename) => {
    return fileSystem[currentPath] && fileSystem[currentPath].includes(filename)
      ? `Contents of ${filename}`
      : "File not found";
  },
  cd: (dir) => {
    const newPath = `${currentPath}/${dir}`;
    if (fileSystem[newPath]) {
      currentPath = newPath;
      return `Changed directory to ${currentPath}`;
    }
    return "Directory not found";
  },
  mkdir: (dir) => {
    if (!fileSystem[currentPath]) fileSystem[currentPath] = [];
    fileSystem[currentPath].push(dir);
    fileSystem[`${currentPath}/${dir}`] = [];
    return `Directory ${dir} created`;
  },
  rm: (filename) => {
    const index = fileSystem[currentPath].indexOf(filename);
    if (index > -1) {
      fileSystem[currentPath].splice(index, 1);
      return `File ${filename} removed`;
    }
    return "File not found";
  },
  echo: (message) => {
    return message;
  },
};

commandInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    const commandText = commandInput.value.trim();
    const [command, ...args] = commandText.split(" ");
    processCommand(command, args.join(" "));
    commandInput.value = "";
  }
});

function processCommand(command, args) {
  const response = commands[command]
    ? commands[command](args)
    : "Command not found";
  outputArea.textContent += `\n> ${command} ${args}\n${response}`;
  outputArea.scrollTop = outputArea.scrollHeight;
}
