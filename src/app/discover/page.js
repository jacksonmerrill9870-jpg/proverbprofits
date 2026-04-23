"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import './discover.css';

const COMMENTS = [
  { id: 1, name: "Monique Lewis", location: "Macon", initials: "ML", color: "#f39c12", text: "Macon here! My whole church is about to hear about this on Sunday" },
  { id: 2, name: "Cedric Moore", location: "Memphis", initials: "CM", color: "#9b59b6", text: "I've shared this with 11 people today. ELEVEN. That's how serious I am about this" },
  { id: 3, name: "Tyrone Clark", location: "Greenville", initials: "TC", color: "#e74c3c", text: "I prayed all week and nothing. Then this video. Then what he shows. Then I ugly cried in my kitchen" },
  { id: 4, name: "Judy Crawford", location: "", initials: "JC", color: "#3498db", text: "I literally gasped out loud. Keep watching. KEEP WATCHING." },
  { id: 5, name: "Cheryl Douglas", location: "Mobile", initials: "CD", color: "#e67e22", text: "Anyone in Mobile? I need someone to talk about this because my family thinks I've lost it" },
  { id: 6, name: "Denise Washington", location: "Columbia", initials: "DW", color: "#2980b9", text: "I genuinely believe this won't be up much longer. This is too good for them to let stay public" },
  { id: 7, name: "Tammy Baker", location: "", initials: "TB", color: "#16a085", text: "I sent this to my sister and she called me back crying. Just watch the whole thing." },
  { id: 8, name: "Yolanda White", location: "", initials: "YW", color: "#2ecc71", text: "I was on my knees last night praying for help. The Lord put this in my feed this morning. Watch the whole thing." },
  { id: 9, name: "Susan Bailey", location: "", initials: "SB", color: "#27ae60", text: "I'm 61 years old and I barely know how to use this phone. If I can understand this ANYONE can. But WATCH FIRST" },
  { id: 10, name: "Doug Bailey", location: "Augusta", initials: "DB", color: "#2980b9", text: "Augusta checking in. Showed this to my coworker on break and she couldn't stop watching either" },
  { id: 11, name: "Tanya Brown", location: "Knoxville", initials: "TB", color: "#2ecc71", text: "Anyone in Knoxville? I need someone to talk about this because my family thinks I've lost it" },
  { id: 12, name: "Donna Simmons", location: "Knoxville", initials: "DS", color: "#27ae60", text: "I can't believe I almost scrolled past this. God is so good." },
  { id: 13, name: "Shawna Thomas", location: "Pensacola", initials: "ST", color: "#e74c3c", text: "I texted my best friend '911 watch this NOW' and she thought someone was hurt. No ma'am just watch" },
  { id: 14, name: "Randy Morrison", location: "Birmingham", initials: "RM", color: "#e67e22", text: "If you prayed for a breakthrough and you're seeing this right now... that's not an accident. Keep watching." },
  { id: 15, name: "Darnell Brown", location: "Chattanooga", initials: "DB", color: "#16a085", text: "Ok I was about to scroll past but something told me to stop. 10 minutes in and I can't look away" },
  { id: 16, name: "Jasmine Scott", location: "", initials: "JS", color: "#9b59b6", text: "My husband was sitting behind me watching over my shoulder. Now he won't give me my phone back" },
  { id: 17, name: "Peggy Ross", location: "", initials: "PR", color: "#3498db", text: "Something in my spirit is telling me this is about to change everything. I can't stop watching" },
  { id: 18, name: "Wanda Green", location: "Memphis", initials: "WG", color: "#8e44ad", text: "Don't you DARE click off this video. What's coming up next is the whole reason you're here" }
];

export default function DiscoverPage() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="discover-wrapper">
      <div className="fb-post-container">
        {/* Header */}
        <div className="post-header">
          <div className="profile-pic">
            <i className="ph-fill ph-cross"></i>
          </div>
          <div className="header-info">
            <div className="page-name">
              Proverbs Profits
              <i className="ph-fill ph-seal-check verified-icon"></i>
            </div>
            <div className="post-meta">
              13h · <span className="live-badge">Live</span> · <i className="ph ph-globe"></i>
            </div>
          </div>
          <div className="post-options">
            <i className="ph ph-dots-three-outline"></i>
          </div>
        </div>

        {/* Content */}
        <div className="post-content">
          <p className="post-text">
            If you prayed for a financial breakthrough this week — God led you to this page. This is not a coincidence.
          </p>
          <div className="live-indicator">
            <div className="red-dot"></div>
            <p>
              This 60-second wifi trick is the answer thousands of believers already received. You were not supposed to scroll past this.
            </p>
          </div>
          <p style={{ marginTop: '15px' }}>
            Press play before this gets taken down 👇🙏
          </p>
        </div>

        {/* Video Section */}
        <Link href="/checkout" style={{ textDecoration: 'none' }}>
          <div className="video-container" onClick={() => setIsPlaying(!isPlaying)}>
            <Image 
              src="/images/pp-mocku1.png" 
              alt="Video Preview" 
              width={680} 
              height={850} 
              className="video-placeholder"
              style={{ filter: isPlaying ? 'none' : 'brightness(0.7)' }}
            />
            
            <div className="video-overlay">
              <div className="subtitles">
                That&apos;s why you&apos;re here
              </div>
              <div className="video-controls">
                <i className={`ph-fill ph-${isPlaying ? 'pause' : 'play'}`}></i>
                <div className="progress-bar">
                  <div className="progress-filled"></div>
                </div>
                <i className="ph-fill ph-speaker-high"></i>
              </div>
            </div>

            {!isPlaying && (
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: '50%', width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyCenter: 'center' }}>
                <i className="ph-fill ph-play" style={{ color: '#fff', fontSize: '3rem', marginLeft: '6px' }}></i>
              </div>
            )}
          </div>
        </Link>

        {/* Engagement Stats */}
        <div className="engagement-stats">
          <div className="icon-group">
            <div className="reaction-circle like"><i className="ph-fill ph-thumbs-up"></i></div>
            <div className="reaction-circle love"><i className="ph-fill ph-heart"></i></div>
            <div className="reaction-circle wow"><i className="ph-fill ph-smiley-wow"></i></div>
            <span style={{ marginLeft: '8px' }}>5.6K</span>
          </div>
          <div>
            1.3K Comments · 2K Shares
          </div>
        </div>

        {/* Engagement Buttons */}
        <div className="engagement-buttons">
          <div className="engagement-btn"><i className="ph ph-thumbs-up"></i> Like</div>
          <div className="engagement-btn"><i className="ph ph-chat-circle"></i> Comment</div>
          <div className="engagement-btn"><i className="ph ph-share-network"></i> Share</div>
        </div>

        {/* Comments Section */}
        <div className="comments-section">
          <div className="most-relevant">
            Most relevant <i className="ph ph-caret-down"></i>
          </div>
          
          <div className="comment-list">
            {COMMENTS.map(comment => (
              <div key={comment.id} className="comment-item">
                <div className="comment-avatar" style={{ backgroundColor: comment.color }}>
                  {comment.initials}
                </div>
                <div className="comment-bubble-wrapper">
                  <div className="comment-bubble">
                    <span className="comment-user">{comment.name}</span>
                    {comment.location && <span className="comment-location">· {comment.location}</span>}
                    <div className="comment-text">{comment.text}</div>
                  </div>
                  <div className="comment-actions">
                    <span>Just now</span>
                    <span>Like</span>
                    <span>Reply</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
