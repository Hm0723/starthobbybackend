import React from "react";
import { Link } from "react-router-dom";
import '../styles/Home.css';

function Home() {
  return (
    <div className="homepage">
      <div className="title">Be Anything, Try Everything</div>
      <div className="image-container">
      <img src="/beachvolleyball.jpg" alt="Beach Volleyball" />
      <img src="/hiking.jpg" alt="Hiking" />
      <img src="/guitar.jpg" alt="Guitar" />
    </div>

    <div className="quiz">
      <div className="quiz-content">
        <div className="quiz-header">
          <div className="quizqn">Looking for a Hobby?</div>
          <Link to="/quiz" className="quizbtn">Start Now</Link>
        </div>
        <div className="quizbio">
          Do our StartHobby Quiz to find out which hobby is for you!
        </div>
      </div>
    </div>

    <div className="bookexperience">
      <div className="title">Start your hobby today</div>
      {/* This is the new section for the hobby cards */}
        <div className="hobby-cards-container">
          {/* Card 1: Table Tennis */}
          <div className="hobby-card">
            <img src="/table-tennis.jpg" alt="Table Tennis" />
            <div className="card-content">
              <h3>Table Tennis</h3>
              <p>Master your paddle!</p>
              <hr />
              <div className="details">
                <span>Sat</span>
                <span>SGD 30</span>
              </div>
              <button className="experience-btn">Experience Now</button>
            </div>
          </div>

          {/* Card 2: Bouldering */}
          <div className="hobby-card">
            <img src="/bouldering.jpg" alt="Bouldering" />
            <div className="card-content">
              <h3>Bouldering</h3>
              <p>Climb, Conquer, Soar!</p>
              <hr />
              <div className="details">
                <span>SGD 50</span>
              </div>
              <button className="experience-btn">Experience Now</button>
            </div>
          </div>

          {/* Card 3: Outdoor Hiking */}
          <div className="hobby-card">
            <img src="/Hike.jpg" alt="Outdoor Hiking" />
            <div className="card-content">
              <h3>Outdoor Hiking</h3>
              <p>Discover the Wilderness Within!</p>
              <hr />
              <div className="details">
                <span>SGD 50</span>
              </div>
              <button className="experience-btn">Experience Now</button>
            </div>
          </div>
        </div>
    </div>
  </div>
  );
}
export default Home;