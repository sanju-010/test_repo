const terminal = document.getElementById("terminal");
let commandHistory = [];
let historyIndex = -1;

let shouldAutoScroll = true;

// Detect manual scroll
terminal.addEventListener("scroll", () => {
  const nearBottom =
    terminal.scrollTop + terminal.clientHeight >= terminal.scrollHeight - 10;
  shouldAutoScroll = nearBottom;
});

const commands = {
  help: `Available commands:
- help           : Show available commands
- about          : Learn about me
- projects       : View my projects
- skills         : See my technical skills
- experience     : My work experience
- contact        : How to reach me
- education      : My educational background
- certifications : View my certifications
- clear          : Clear the terminal`,

  about:
    "Hi, I'm Sanju Santhosh, a software engineer with 1 year of experience in full-stack web development. I specialize in WordPress, .NET, and Angular development. Type 'help' to explore more about my work and skills.",

  projects: `Projects:
    1. Greenads Global - A responsive business website developed with WordPress and Elementor.
       Live: <a href="https://www.greenadsglobal.com/" target="_blank">greenadsglobal.com</a>
    2. SPL Components - Custom WordPress development for a UK-based component supplier.
       Live: <a href="https://www.splcomponentsltd.co.uk/" target="_blank">splcomponentsltd.co.uk</a>`,

  skills: `Technical Skills:
- Languages       : JavaScript, C#, Python, PHP, HTML, CSS, LESS
- Frameworks      : .NET Core, ASP.NET, MVC, Django, Angular, WebForms
- CMS & Tools     : WordPress, WooCommerce, Elementor, GitHub
- Databases       : MySQL
- Other           : REST APIs, Payment Gateway Integration, SEO, Responsive Design`,

  experience: `Work Experience:
1. DotNet Developer - Astrins Technologies (03/2025 – Present)
   - Backend & API development using .NET Core, ASP.NET, and MVC.
   - Frontend using Angular and WebForms.
   - Integrated payment gateways and third-party APIs.

2. Software Engineer - Yatnam Technologies (11/2023 – 12/2024)
   - Built websites and eCommerce stores using WordPress, WooCommerce, and Elementor.
   - Developed backend systems using Python and Django.
   - Focused on SEO, speed optimization, and responsive design.`,

  contact: `You can reach me at:
   - Phone    : <a href="tel:8606884750" target="_blank">8606884750</a>
   - Email    : <a href="mailto:sanjusanthosh61@gmail.com" target="_blank">sanjusanthosh61@gmail.com</a>
   - LinkedIn : <a href="https://www.linkedin.com/in/sanju-santhosh" target="_blank">linkedin.com/in/sanju-santhosh</a>
   - Location : Aluva, Kerala`,

  education: `Education:
- MCA – Union Christian College, Aluva (2021 – 2023)
- BCA – Jai Bharath Arts and Science College, Vegola (2018 – 2021)`,

  certifications: `Certifications:
(Currently not listed, but you can add them here if available)`,

  clear: "__CLEAR__",
};

function createInputLine() {
  const line = document.createElement("div");
  line.className = "line";

  const prompt = document.createElement("span");
  prompt.className = "prompt";
  prompt.textContent = "sanju@portfolio:~$";

  const input = document.createElement("input");
  input.className = "input";
  input.type = "text";

  line.appendChild(prompt);
  line.appendChild(input);
  terminal.appendChild(line);

  input.focus();

  input.addEventListener("keydown", (e) => {
    // ⬇️ Auto scroll to bottom 1
    terminal.scrollTop = terminal.scrollHeight;
    // Handle ENTER Key
    if (e.key === "Enter") {
      const command = input.value.trim();
      input.disabled = true;

      if (command) {
        commandHistory.push(command);
        historyIndex = commandHistory.length;
      }

      handleCommand(command);
    }
    // Handle UP arrow
    else if (e.key === "ArrowUp") {
      if (historyIndex > 0) {
        historyIndex--;
        input.value = commandHistory[historyIndex];
      }
      e.preventDefault(); // prevent cursor jump
    }
    // Handle DOWN arrow
    else if (e.key === "ArrowDown") {
      if (historyIndex < commandHistory.length - 1) {
        historyIndex++;
        input.value = commandHistory[historyIndex];
      } else {
        historyIndex = commandHistory.length;
        input.value = "";
      }
      e.preventDefault(); // prevent cursor jump
    }
  });

  // terminal click on focus
  terminal.addEventListener("click", () => {
    // Get all input elements inside terminal
    const inputs = terminal.querySelectorAll(".input");
    if (inputs.length > 0) {
      const lastInput = inputs[inputs.length - 1];
      if (!lastInput.disabled) {
        lastInput.focus();
      }
    }
  });
}

function handleCommand(cmd) {
  if (cmd === "") {
    createInputLine();
    return;
  }

  const lower = cmd.toLowerCase();
  const result = commands[lower];

  if (!result) {
    const suggestion = getClosestCommand(cmd);
    const msg = suggestion
      ? `Command not found: ${cmd}. Did you mean: ${suggestion}?`
      : `Command not found: ${cmd}`;
    typeOutput(msg, () => createInputLine());
    return;
  }
  

  if (typeof result === "function") {
    typeOutput(result(), () => createInputLine());
  } else if (result === "__CLEAR__") {
    terminal.innerHTML = "";
    createInputLine();
  } else {
    typeOutput(result, () => createInputLine());
  }
}

function typeOutput(html, callback, speed = 10) {
  const out = document.createElement("div");
  out.className = "output-line";
  terminal.appendChild(out);

  const temp = document.createElement("div");
  temp.innerHTML = html;

  let nodes = Array.from(temp.childNodes);

  function typeNode(nodeIndex = 0) {
    if (nodeIndex >= nodes.length) {
      callback && callback();
      return;
    }

    const node = nodes[nodeIndex];

    if (node.nodeType === Node.TEXT_NODE) {
      let text = node.textContent;
      let i = 0;

      function typeChar() {
        if (i < text.length) {
          out.appendChild(document.createTextNode(text.charAt(i)));
          if (shouldAutoScroll) terminal.scrollTop = terminal.scrollHeight;
          i++;
          setTimeout(typeChar, speed);
        } else {
          typeNode(nodeIndex + 1);
        }
      }

      typeChar();

    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const clone = node.cloneNode(false); // Copy tag without children
      out.appendChild(clone);

      // Recursively type children into the cloned tag
      const childNodes = Array.from(node.childNodes);
      const childOut = clone;

      function typeChild(childIndex = 0) {
        if (childIndex >= childNodes.length) {
          typeNode(nodeIndex + 1);
          return;
        }

        const child = childNodes[childIndex];

        if (child.nodeType === Node.TEXT_NODE) {
          let text = child.textContent;
          let i = 0;

          function typeChar() {
            if (i < text.length) {
              childOut.appendChild(document.createTextNode(text.charAt(i)));
              if (shouldAutoScroll) terminal.scrollTop = terminal.scrollHeight;
              i++;
              setTimeout(typeChar, speed);
            } else {
              typeChild(childIndex + 1);
            }
          }

          typeChar();

        } else if (child.nodeType === Node.ELEMENT_NODE) {
          const innerClone = child.cloneNode(false);
          childOut.appendChild(innerClone);

          // Recursively handle nested elements
          const nested = Array.from(child.childNodes);
          nodes.splice(nodeIndex + 1, 0, ...nested);
          typeNode(nodeIndex + 1);
        }
      }

      typeChild();
    }
  }

  typeNode();
}



window.onload = () => {
  createInputLine();
  updatetime();
  // getTerminalHeight();
};

function updatetime() {
  const footerspans = document.querySelectorAll("footer span");
  const timespan = footerspans[1];
  const now = new Date();

  const dd = String(now.getDate()).padStart(2, "0");
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const yyyy = now.getFullYear();

  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? hours : 12;
  hours = String(hours).padStart(2, "0");

  timespan.textContent = `${dd}/${mm}/${yyyy}, ${hours}:${minutes}:${seconds} ${ampm}`;
}
setInterval(updatetime, 1000);

// to get height of the terminal wrapper
// function getTerminalHeight() {
//   const wrap = document.querySelector('.portfolio');
//   const terminal = document.getElementById('terminal');
//   if (wrap && terminal) {
//     const height = wrap.offsetHeight;
//     console.log(height);
//     // terminal.style.height = height + 'px';
//   }
// }

// window.addEventListener('resize', () => {
//   getTerminalHeight();
// })


// suggest related word in the command
const validCommands = Object.keys(commands);

function getClosestCommand(input) {
  let closest = "";
  let minDistance = Infinity;

  for (let cmd of validCommands) {
    const dist = levenshteinDistance(input, cmd);
    if (dist < minDistance) {
      minDistance = dist;
      closest = cmd;
    }
  }

  return minDistance <= 2 ? closest : null; // Only suggest if it's a close match
}

function levenshteinDistance(a, b) {
  const matrix = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}
