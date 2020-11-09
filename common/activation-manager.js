const Activation = require("./Activation"),
  em = require( "./extension-manager" )

const activationRegister = []

module.exports.register = ( plugin, activationPoint, path ) => {
  const duplicate = activationRegister.findIndex( act => 
    act.plugin === plugin && act.activationPoint === activationPoint
  )

  if ( duplicate < 0 ) activationRegister.push( new Activation( plugin, activationPoint, path ) )

  console.log( 'activationRegister', activationRegister )
}

module.exports.triggerActivation = activation => {
  activationRegister.forEach( act => {
     if ( act.activationPoint === activation ) {
      act.trigger( em.getExtensionPoints() )
     }
  })
}