import supabase from '../config/Database.js'; // Adjust the path as needed

const verifyGroupMembership = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const { data: { user }, error } = await supabase.auth.api.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid token.' });
    }

    req.user = user;

    const groupId = req.body.groupId || req.params.groupId;

    if (!groupId) {
      return res.status(400).json({ error: 'groupId must be provided.' });
    }

    const { data: userGroups, error: userGroupError } = await supabase
      .from('user_groups')
      .select('*')
      .eq('user_id', user.id)
      .eq('group_id', groupId);

    if (userGroupError || userGroups.length === 0) {
      return res.status(403).json({ error: 'Access denied. User is not a member of the specified group.' });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error.' });
  }
};

export default verifyGroupMembership;