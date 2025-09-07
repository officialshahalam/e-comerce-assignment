import React, { FC } from "react";
import StarFilled from "../../../public/svgs/StarFilled";
import HalfStar from "../../../public/svgs/HalfStar";
import StarOutline from "../../../public/svgs/StarOutline";

type Props = {
  rating: number;
};

const Ratings: FC<Props> = ({ rating }) => {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(<StarFilled key={`star-${i}`} />);
    } else if (i - rating <= 0.5) {
      stars.push(<HalfStar key={`star-${i}`} />);
    } else {
      stars.push(<StarOutline key={`star-${i}`} />);
    }
  }

  return <div className="flex items-center">{stars}</div>;
};

export default Ratings;
