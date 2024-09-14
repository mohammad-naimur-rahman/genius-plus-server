import chalk from 'chalk'
import * as fs from 'fs'
import * as path from 'path'

// Define the base path for modules (relative to the script location)
const MODULES_PATH = path.join(__dirname, '..', 'app', 'modules')

// Function to create a new module
const createModule = (moduleName: string) => {
  const folderName = moduleName.toLowerCase()
  const singularName = moduleName.slice(0, -1).toLowerCase()

  const modulePath = path.join(MODULES_PATH, folderName)

  // Create the module folder if it doesn't exist
  if (!fs.existsSync(modulePath)) {
    fs.mkdirSync(modulePath, { recursive: true })
    console.log(chalk.cyanBright(`Created folder: ${folderName}\n`))
  } else {
    console.log(chalk.yellow(`Folder ${folderName} already exists`))
  }

  // Create the necessary files
  const fileTypes = ['schema', 'validation', 'routes', 'controller', 'service']
  fileTypes.forEach(fileType => {
    const fileName = `${singularName}.${fileType}.ts`
    const filePath = path.join(modulePath, fileName)

    // Check if the file already exists
    if (!fs.existsSync(filePath)) {
      // Create an empty file
      fs.writeFileSync(filePath, '')
      console.log(chalk.green(`Created file: ${fileName}`))
    } else {
      console.log(chalk.yellow(`File ${fileName} already exists, skipping...`))
    }
  })

  // Final success message
  console.log(
    chalk.blue.bold(`\nModule "${moduleName}" has been set up successfully. ✨`)
  )
}

// Get the module name from the command line argument
const moduleName = process.argv[2]

if (!moduleName) {
  console.error(chalk.red('Please provide a module name.'))
  process.exit(1)
}

// Create the module
createModule(moduleName)
