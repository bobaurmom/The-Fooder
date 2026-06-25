// import { supabase } from '../../supabaseClient.js'
// export async function verifyToken(req, res, next) {
//   try {
//     const authHeader = req.headers.authorization
//     const token = authHeader?.replace('Bearer ', '')

//     if (!token) {
//       return res.status(401).json({ error: 'No authorization token provided' })
//     }

//     const { data: { user }, error } = await supabase.auth.getUser(token)

//     if (error || !user) {
//       return res.status(401).json({ error: 'Invalid or expired token' })
//     }

//     req.user = user
//     next()
//   } catch (error) {
//     console.error('Auth error:', error)
//     res.status(401).json({ error: 'Authentication failed' })
//   }
// }v
// export function optional(req, res, next) {
//   try {
//     const authHeader = req.headers.authorization
//     const token = authHeader?.replace('Bearer ', '')

//     if (token) {
//       supabase.auth.getUser(token).then(({ data: { user } }) => {
//         if (user) {
//           req.user = user
//         }
//         next()
//       })
//     } else {
//       next()
//     }
//   } catch (error) {
//     next()
//   }
// }

import { supabase } from '../../supabaseClient.js';

export async function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'No authorization token provided' });
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
}