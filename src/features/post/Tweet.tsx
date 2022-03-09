import React from "react";

export const Tweet: React.FC<{
  id: number;
  tweetText: string;
  createdAt: string;
}> = ({ tweetText, createdAt }) => {
  return (
    <div>
      {tweetText}
      <br />
      {createdAt}
    </div>
  );
};
