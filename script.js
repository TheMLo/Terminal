document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('command-input');
  const output = document.getElementById('output');
  const history = [];
  let historyIndex = -1;

  const commands = {
      help: () => `Available commands:
          'help' - Show this help message
          'clear' - Clear terminal
          'echo [text]' - Display text
          'triangle [size]' - Draw triangle
          'time' - Show current time
          'calc [expression]' - Calculate expression
          'color [hex]' - Change text color`,
      
      clear: () => {
          output.innerHTML = '';
          return '';
      },

      echo: (args) => args.join(' '),

      triangle: (args) => {
          const size = parseInt(args[0]) || 5;
          let result = '';
          for(let i = 1; i <= size; i++) {
              result += '*'.repeat(i) + '\n';
          }
          const triangleDiv = document.createElement('pre');
          triangleDiv.className = 'triangle-art';
          triangleDiv.textContent = result;
          output.appendChild(triangleDiv);
          return '';
      },

      time: () => new Date().toLocaleString(),

      calc: (args) => {
          try {
              return eval(args.join('')); 
          } catch {
              return 'Invalid expression';
          }
      },

      color: (args) => {
          const color = args[0];
          if(/^#[0-9A-F]{6}$/i.test(color)) {
              output.style.color = color;
              return `Color changed to ${color}`;
          }
          return 'Invalid color code. Use hex format (#RRGGBB)';
      }
  };

  function addOutput(content, className = '') {
      const line = document.createElement('div');
      line.className = `output-line ${className}`;
      line.textContent = content;
      output.appendChild(line);
      output.scrollTop = output.scrollHeight;
  }

  input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
          const command = input.value.trim();
          if (command) {
              history.push(command);
              historyIndex = history.length;
              
              addOutput(`> ${command}`);
              
              const [cmd, ...args] = command.split(' ');
              
              if (commands[cmd]) {
                  const result = commands[cmd](args);
                  if (result) addOutput(result, 'success');
              } else {
                  addOutput(`Command not found: ${cmd}`, 'error');
              }
              
              input.value = '';
          }
      } else if (e.key === 'ArrowUp') {
          if (historyIndex > 0) {
              historyIndex--;
              input.value = history[historyIndex];
          }
          e.preventDefault();
      } else if (e.key === 'ArrowDown') {
          if (historyIndex < history.length - 1) {
              historyIndex++;
              input.value = history[historyIndex];
          } else {
              historyIndex = history.length;
              input.value = '';
          }
      }
  });
});