const jsdoc2md = require( "jsdoc-to-markdown" ),
  fs = require( "fs" ).promises,
  { resolve, join } = require( "path" )

const base = resolve( __dirname, '..' ),
  wiki = 'wiki',
  lib = 'lib'

// Create API documentation
const createDoc = async ( inFiles, tmpl, outFile ) => {
  try {
    // Prepare input data
    const files = inFiles.map( glob => join( base, lib, glob ) )
    const template = await fs.readFile( join( __dirname, tmpl ), 'utf8' )

    // Generate documentation and write to file
    const md = await jsdoc2md.render( { files, template } )
    await fs.writeFile( join( base, wiki, outFile ), md )      
  } catch ( error ) {
    console.log( error )
  }
}

// Generate main process documentation
createDoc(
  [ 'main/*.js' ],
  'main-API.hbs',
  'main-API.md'
)

// Generate renderer documentation
createDoc(
  [ 'renderer/*.js', 'common/*.js' ],
  'renderer-API.hbs',
  'renderer-API.md'
)
