"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import './discover.css';


const ALL_COMMENTS = [
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

const TIMERS = [5000, 7000, 10000];

export default function DiscoverPage() {
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);

  const [visibleComments, setVisibleComments] = useState(
    ALL_COMMENTS.slice(0, 5).map(c => ({ ...c, addedAt: Date.now() - 60000 }))
  );
  const [nextCommentIndex, setNextCommentIndex] = useState(5);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [duration, setDuration] = useState(0);
  const [videoProgress, setVideoProgress] = useState(0);
  const [reactions, setReactions] = useState([]);
  const videoRef = useRef(null);

  // Update current time every second for relative timestamps
  useEffect(() => {
    const timeInterval = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(timeInterval);
  }, []);

  // Sync video progress
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setVideoProgress((video.currentTime / video.duration) * 100);
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, []);

  // Floating reactions generator
  useEffect(() => {
    const icons = ['❤️', '😮', '🔥', '🙏', '💯'];
    const interval = setInterval(() => {
      if (isPlaying) {
        const id = Date.now();
        const icon = icons[Math.floor(Math.random() * icons.length)];
        const left = 70 + Math.random() * 25; // Cluster on the right
        setReactions(prev => [...prev, { id, icon, left }]);
        
        // Remove after animation
        setTimeout(() => {
          setReactions(prev => prev.filter(r => r.id !== id));
        }, 4000);
      }
    }, 800);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Varied Comment Timer: 5s, 7s, 10s cycle
  useEffect(() => {
    if (nextCommentIndex >= ALL_COMMENTS.length) return;

    const timerIndex = (nextCommentIndex - 5) % TIMERS.length;
    const delay = TIMERS[timerIndex];

    const timeoutId = setTimeout(() => {
      const newComment = { ...ALL_COMMENTS[nextCommentIndex], addedAt: Date.now() };
      setVisibleComments(prev => [newComment, ...prev]);
      setNextCommentIndex(prev => prev + 1);

    }, delay);

    return () => clearTimeout(timeoutId);
  }, [nextCommentIndex]);

  const togglePlay = (e) => {
    e.preventDefault();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (e) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const clickedValue = (x / rect.width) * video.duration;
    video.currentTime = clickedValue;
  };

  const getTimeAgo = (timestamp) => {
    const seconds = Math.floor((currentTime - timestamp) / 1000);
    if (seconds < 5) return "Just now";
    if (seconds < 60) return `${seconds}s`;
    return `${Math.floor(seconds / 60)}m`;
  };

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

        {/* CTA Button Above Video */}
        <div className="post-cta-wrapper">
          <Link href="/checkout" className="btn-get-started">
            Get Started Now For $30 Off &gt;&gt;
          </Link>
        </div>

        {/* Video Section */}
        <div className="video-container" onClick={togglePlay}>
          <video 
            ref={videoRef}
            src="https://res.cloudinary.com/dtgbqtaay/video/upload/f_auto,q_auto:best/lv_0_20260423200427_hyxa3r.mp4"
            poster="https://res.cloudinary.com/dtgbqtaay/video/upload/f_auto,q_auto/lv_0_20260423200427_hyxa3r.jpg"
            className="video-placeholder"
            playsInline
            preload="auto"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => router.push('/checkout')}
          />


          
          <div className="video-overlay">
            <div className="subtitles">
              That&apos;s why you&apos;re here
            </div>
            <div className="video-controls">
              <i className={`ph-fill ph-${isPlaying ? 'pause' : 'play'}`}></i>
              <div className="progress-bar" onClick={handleSeek}>
                <div className="progress-filled" style={{ width: `${videoProgress}%` }}></div>
                <div className="progress-handle" style={{ left: `${videoProgress}%` }}></div>
              </div>
              <i className="ph-fill ph-speaker-high"></i>
            </div>
          </div>

          {/* Floating Reactions */}
          <div className="reactions-container">
            {reactions.map(r => (
              <div key={r.id} className="floating-reaction" style={{ left: `${r.left}%` }}>
                {r.icon}
              </div>
            ))}
          </div>

          {!isPlaying && (
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: '50%', width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5 }}>
              <i className="ph-fill ph-play" style={{ color: '#fff', fontSize: '3rem', marginLeft: '6px' }}></i>
            </div>
          )}
          
          {/* Invisible Overlay to redirect on click while playing if desired, 
              but standard behavior is to allow play/pause */}
          {isPlaying && (
            <Link href="/checkout" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '70%', zIndex: 1 }} onClick={(e) => e.stopPropagation()}>
              <div style={{ width: '100%', height: '100%' }}></div>
            </Link>
          )}
        </div>

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
          
          <div className="comment-list" style={{ maxHeight: '600px', overflowY: 'auto', paddingRight: '5px' }}>
            {visibleComments.map((comment, index) => (
              <div key={comment.id || index} className="comment-item" style={{ animation: 'fade-in 0.5s ease-out' }}>
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
                    <span>{getTimeAgo(comment.addedAt)}</span>
                    <span>Like</span>
                    <span>Reply</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      `}</style>
    </div>
  );
}
