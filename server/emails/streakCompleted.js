const streakCompletedTemplate = (days) => `
  <div style="font-family: Arial; padding: 16px;">
    <h2>🔥 ${days}-Day Learning Streak!</h2>
    <p>Amazing consistency!</p>
    <p>You’ve completed learning activities for <b>${days} consecutive days</b>.</p>
    <p>Keep going — habits build careers 🚀</p>
  </div>
`;

module.exports = { streakCompletedTemplate };
