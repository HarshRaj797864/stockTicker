// using a logger to prove sub 100ms claim
export const latencyLogger = (req, res, next) => {
  const start = performance.now(); 

  res.on('finish', () => {
    const duration = performance.now() - start;
    
    
    const color = duration < 100 ? '\x1b[32m' : '\x1b[31m'; 
    const reset = '\x1b[0m';

    console.log(`${req.method} ${req.originalUrl} ${color}${duration.toFixed(2)}ms${reset}`);
  });

  next();
};
