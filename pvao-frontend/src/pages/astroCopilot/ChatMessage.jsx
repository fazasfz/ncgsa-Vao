import React from 'react';
import { Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import styles from './ChatMessage.module.css';

/**
 * ChatMessage component for rendering individual messages in AstroCopilotWorkspace.
 *
 * @param {Object} props
 * @param {Object} props.message - The message object
 * @param {string} props.message.text - Content of the message
 * @param {('user'|'bot'|'ai')} props.message.sender - Sender of the message
 * @param {boolean} [props.message.isStreaming] - Whether the message is actively receiving streaming chunks
 * @param {boolean} [props.message.error] - Whether this message represents an error
 */
const ChatMessage = ({ message }) => {
  const isUser = message.sender === 'user';
  const isBot = message.sender === 'bot' || message.sender === 'ai';

  return (
    <div
      className={`${styles.messageRow} ${
        isUser ? styles.rowUser : styles.rowBot
      }`}
    >
      {/* Bot Avatar */}
      {isBot && (
        <div className={`${styles.avatar} ${styles.avatarBot}`}>
          <Bot size={18} />
        </div>
      )}

      {/* Message Bubble */}
      <div
        className={`${styles.bubble} ${
          isUser
            ? styles.bubbleUser
            : message.error
            ? styles.bubbleError
            : styles.bubbleBot
        }`}
      >
        <div className={styles.markdownContent}>
          <ReactMarkdown
            rehypePlugins={[rehypeKatex]}
            remarkPlugins={[remarkMath]}
            components={{
              a: ({ node, ...props }) => (
                <a
                  {...props}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              ),
              p: ({ children }) => <p>{children}</p>,
              ul: ({ children }) => <ul>{children}</ul>,
              ol: ({ children }) => <ol>{children}</ol>,
              code: ({ node, inline, className, children, ...props }) => (
                <code {...props}>{children}</code>
              ),
            }}
          >
            {message.text}
          </ReactMarkdown>

          {/* Streaming Indicator */}
          {message.isStreaming && !message.text && (
            <div className={styles.streamingIndicator}>
              <span className={styles.pulseDotSmall} />
              <span>Receiving observatory telemetry...</span>
            </div>
          )}
          {message.isStreaming && message.text && (
            <span className={styles.cursor} />
          )}
        </div>
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className={`${styles.avatar} ${styles.avatarUser}`}>
          <User size={18} />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
