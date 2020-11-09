module.exports = class ExtensionPoint {
  name
  plugins = []

  constructor( name ) {
    this.name = name
  }

  register( name, response, priority = 0 ) {
    const index = this.plugins.findIndex( p => p.priority > priority )
    const newPlg = { name, response, priority }
    if ( index > -1 ) {
      this.plugins.splice( index, 0, newPlg )
    } else {
      this.plugins.push( newPlg )
    }
    console.log( this )
  }

  execute( input ) {
    return Promise.all( this.plugins.map( p => {
      if ( typeof p.response === 'function' ) {
        return p.response( input )
      } else  {
        return p.response
      }
    }))
  }

  async executeSerial( input ) {
    return await this.plugins.reduce( async ( throughput, p ) => {
      let tp = await throughput 
      if ( typeof p.response === 'function' ) {
        tp = await p.response( tp )
      } else {
        tp.push( p.response )
      }      
      return tp
    }, input )
  }
}
