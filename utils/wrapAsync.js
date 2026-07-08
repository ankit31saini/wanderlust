//, dono versions practically same kaam karenge, bas syntax thoda different hai.

module.exports = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    }}



// module.exports = (fn)=>{
//     return (req,res,next)=>{
//         fn(req,res,next).catch((err) => { next(err) });
//     }
// }