const {getDefaultConfig}=require('expo/metro-config');
const config=getDefaultConfig(__dirname);
config.resolver.assetExts.push('wasm');
const enhance=config.server.enhanceMiddleware;
config.server.enhanceMiddleware=(middleware,server)=>{
 const next=enhance?enhance(middleware,server):middleware;
 return (req,res,done)=>{res.setHeader('Cross-Origin-Embedder-Policy','credentialless');res.setHeader('Cross-Origin-Opener-Policy','same-origin');return next(req,res,done);};
};
module.exports=config;
