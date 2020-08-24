export const tokenStore = (( Token ) => {
  return new Token();
})( function () {
  const callbacks = [];
  this.token = "";
  this.onUpdate = callback => {
    if ( typeof callback === "function" ) {
      callbacks.push( callback );
    }
  };
  this.setToken = ( jwt = "" ) => {
    this.token = jwt;
    // trigger updates
    callbacks.forEach( fn => fn( this.token ) );
  };
} );
