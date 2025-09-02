import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const DashboardCard = ({ name, value, icon: Icon, link }) => {
  const navigate = useNavigate();
  return (
    <StyledWrapper>
      <div className="card">
        <div className="card-details">
          {Icon && <Icon className="card-icon" />}
          <p className="text-title">{name}</p>
          <p className="text-body text-xl font-bold">{value}</p>
        </div>
        <button className="card-button">
          More info
        </button>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .card {
    width: 230px;
    height: 200px;
    border-radius: 20px;
    background: #f5f5f5;
    position: relative;
    padding: 1.8rem;
    border: 2px solid #c3c6ce;
    transition: 0.5s ease-out;
    overflow: visible;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .card-details {
    color: black;
    height: 100%;
    gap: 0.5em;
    display: grid;
    place-content: center;
    text-align: center;
  }

  .card-icon {
    width: 32px;
    height: 32px;
    color: #008bf8;
    margin: 0 auto 0.5rem auto;
  }

  .card-button {
    transform: translate(-50%, 125%);
    width: 60%;
    border-radius: 1rem;
    border: none;
    background-color: #008bf8;
    color: #fff;
    font-size: 1rem;
    padding: 0.5rem 1rem;
    position: absolute;
    left: 50%;
    bottom: 0;
    opacity: 0;
    transition: 0.3s ease-out;
    cursor: pointer;
  }

  .text-body {
    color: rgb(134, 134, 134);
  }

  .text-title {
    font-size: 1.5em;
    font-weight: bold;
  }

  /* Hover effects */
  .card:hover {
    border-color: #008bf8;
    box-shadow: 0 4px 18px 0 rgba(0, 0, 0, 0.25);
  }

  .card:hover .card-button {
    transform: translate(-50%, 50%);
    opacity: 1;
  }
`;

export default DashboardCard;
