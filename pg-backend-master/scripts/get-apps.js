/* eslint-disable @typescript-eslint/no-var-requires */
const nestCliFile = require('../nest-cli.json');
const { projects } = nestCliFile;
const applications = Object.keys(projects).filter(
  (prKey) => projects[prKey].type === 'application',
);
process.stdout.write(applications.join(' ') + '\n');
