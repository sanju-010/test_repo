const terminal = document.getElementById("terminal");
let commandHistory = [];
let historyIndex = -1;

let shouldAutoScroll = true;

// Detect manual scroll
terminal.addEventListener("scroll", () => {
  const nearBottom = terminal.scrollTop + terminal.clientHeight >= terminal.scrollHeight - 10;
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
- leadership     : Leadership and community involvement
- sports         : My sports involvement
- clear          : Clear the terminal`,
  
  about: "Hi, I'm Sanju. This is a simulated command-line portfolio built using HTML + JavaScript. Type 'help' to see what you can explore.",

  projects: `Completed Projects:
1. Expense Tracker PWA - A personal finance tracker with offline support and chart analysis.
2. Temple Management System - A full-stack .NET-based system for managing temple activities.
3. Game Portal - A website featuring simple JavaScript games like Snake and Tic-Tac-Toe.
4. Smart House Planner - An Angular app to design and simulate smart home layouts.
(More projects coming soon...)`,

  skills: `Technical Skills:
- Languages   : JavaScript, C#, SQL, HTML, CSS
- Frameworks  : .NET Core, Angular, Ionic, Flutter (basic)
- Tools       : Docker, Git, MySQL, Firebase
- Other       : PWA, REST APIs, RDLC Reports`,

  experience: `Work Experience:
- Backend Developer Intern at XYZ Pvt Ltd (2023 - 2024)
  Worked on RESTful APIs, billing modules, and database design.`,

  contact: `You can reach me at:
- Email   : sanju@example.com
- GitHub  : github.com/sanjudev
- LinkedIn: linkedin.com/in/sanju`,

  education: `Educational Background:
- Bachelor of Computer Applications (BCA)
- Master of Computer Applications (MCA)`,

  certifications: `Certifications:
- Full Stack Development with .NET (Udemy)
- Angular & Firebase Bootcamp (freeCodeCamp)
- Database Management with MySQL (Coursera)`,

  leadership: `Leadership & Community:
- Headed college coding club for 2 years
- Organized technical fests and inter-college hackathons
- Mentored juniors in full-stack web development`,

  sports: `Sports:
- Cricket: Represented the district team in several state-level tournaments.
  Played as an all-rounder and helped the team win multiple matches.`,

  time: () => `Current Time: ${new Date().toLocaleTimeString()}`,

  clear: "__CLEAR__"
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
    typeOutput(`Command not found: ${cmd}`, () => createInputLine());
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


function typeOutput(text, callback, speed = 10) {
  // ⬇️ Auto scroll to bottom 2
  terminal.scrollTop = terminal.scrollHeight;
  const out = document.createElement("div");
  out.className = "output-line";
  terminal.appendChild(out);

  let i = 0;
  function typeNext() {
    if (i < text.length) {
      out.textContent += text.charAt(i);

      // ⬇️ Auto scroll to bottom 3
      // terminal.scrollTop = terminal.scrollHeight;
      if (shouldAutoScroll) {
        terminal.scrollTop = terminal.scrollHeight;
      }

      i++;
      setTimeout(typeNext, speed);
    } else {
      out.textContent += "\n";
      callback && callback();
    }
  }

  typeNext();
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

  const dd = String(now.getDate()).padStart(2, '0');
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const yyyy = now.getFullYear();

  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;
  hours = hours ? hours : 12;
  hours = String(hours).padStart(2, '0');

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






