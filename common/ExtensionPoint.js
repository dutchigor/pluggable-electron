module.exports = class ExtensionPoint {
  name
  extensions = []

  constructor( name ) {
    this.name = name
  }

  register( name, response, priority = 0 ) {
    const index = this.extensions.findIndex( p => p.priority > priority )
    const newExt = { name, response, priority }
    if ( index > -1 ) {
      this.extensions.splice( index, 0, newExt )
    } else {
      this.extensions.push( newExt )
    }
    console.log( this )
  }

  execute( input ) {
    return Promise.all( this.extensions.map( p => {
      if ( typeof p.response === 'function' ) {
        return p.response( input )
      } else  {
        return p.response
      }
    }))
  }

  async executeSerial( input ) {
    return await this.extensions.reduce( async ( throughput, p ) => {
      let tp = await throughput 
      if ( typeof p.response === 'function' ) {
        tp = await p.response( tp )
      } else if ( Array.isArray( tp ) ) {
        tp.push( p.response )
      }      
      return tp
    }, input )
  }
}
