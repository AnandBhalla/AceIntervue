import React, { useState } from 'react';
import '../styles/CodingInterviewPage.css';

const CodingInterviewPage = () => {
  const [code, setCode] = useState(`// Write your solution here
function twoSum(nums, target) {
    // Your code here
}`);
  
  const [testResults, setTestResults] = useState([]);
  const [activeTab, setActiveTab] = useState('problem');

  const sampleProblem = {
    title: "Two Sum",
    difficulty: "Easy",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
      }
    ],
    constraints: [
      "2 ≤ nums.length ≤ 10⁴",
      "-10⁹ ≤ nums[i] ≤ 10⁹",
      "-10⁹ ≤ target ≤ 10⁹"
    ]
  };

  const handleRunTests = () => {
    // Simulate test execution
    const mockResults = [
      { id: 1, input: "[2,7,11,15], 9", expected: "[0,1]", actual: "[0,1]", passed: true },
      { id: 2, input: "[3,2,4], 6", expected: "[1,2]", actual: "[1,2]", passed: true },
      { id: 3, input: "[3,3], 6", expected: "[0,1]", actual: "[0,1]", passed: true }
    ];
    setTestResults(mockResults);
  };

  return (
    <div className="coding-interview-page">
      {/* Video Section */}
      <div className="video-section">
        <div className="video-container">
          <div className="video-box interviewer-video">
            <div className="video-placeholder">
              <h3>AI Interviewer</h3>
              <p>John Doe</p>
            </div>
            <div className="video-controls">
              <button className="control-btn">🎤</button>
              <button className="control-btn">📹</button>
            </div>
          </div>
          <div className="video-box candidate-video">
            <div className="video-placeholder">
              <h3>You</h3>
              <p>Ready for interview</p>
            </div>
            <div className="video-controls">
              <button className="control-btn">🎤</button>
              <button className="control-btn">📹</button>
              <button className="speak-btn">🎙️ Speak</button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Problem Section */}
        <div className="problem-section">
          <div className="problem-tabs">
            <button 
              className={`tab-btn ${activeTab === 'problem' ? 'active' : ''}`}
              onClick={() => setActiveTab('problem')}
            >
              Problem
            </button>
            <button 
              className={`tab-btn ${activeTab === 'hints' ? 'active' : ''}`}
              onClick={() => setActiveTab('hints')}
            >
              Hints
            </button>
            <button 
              className={`tab-btn ${activeTab === 'solution' ? 'active' : ''}`}
              onClick={() => setActiveTab('solution')}
            >
              Solution
            </button>
          </div>

          <div className="problem-content">
            {activeTab === 'problem' && (
              <div className="problem-details">
                <div className="problem-header">
                  <h2>{sampleProblem.title}</h2>
                  <span className={`difficulty ${sampleProblem.difficulty.toLowerCase()}`}>
                    {sampleProblem.difficulty}
                  </span>
                </div>
                
                <div className="problem-description">
                  <p>{sampleProblem.description}</p>
                </div>

                <div className="examples">
                  <h3>Examples:</h3>
                  {sampleProblem.examples.map((example, index) => (
                    <div key={index} className="example">
                      <p><strong>Input:</strong> {example.input}</p>
                      <p><strong>Output:</strong> {example.output}</p>
                      <p><strong>Explanation:</strong> {example.explanation}</p>
                    </div>
                  ))}
                </div>

                <div className="constraints">
                  <h3>Constraints:</h3>
                  <ul>
                    {sampleProblem.constraints.map((constraint, index) => (
                      <li key={index}>{constraint}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'hints' && (
              <div className="hints-content">
                <h3>Hints</h3>
                <div className="hint-item">
                  <p>💡 Think about using a hash map to store numbers you've seen</p>
                </div>
                <div className="hint-item">
                  <p>💡 For each number, check if target - current number exists in your hash map</p>
                </div>
              </div>
            )}

            {activeTab === 'solution' && (
              <div className="solution-content">
                <h3>Solution Approach</h3>
                <p>This problem can be solved efficiently using a hash map approach with O(n) time complexity.</p>
                <pre className="solution-code">
{`function twoSum(nums, target) {
    const map = new Map();
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        
        map.set(nums[i], i);
    }
    
    return [];
}`}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Code Editor Section */}
        <div className="code-section">
          <div className="editor-header">
            <span>JavaScript</span>
            <div className="editor-actions">
              <button className="action-btn">Reset</button>
              <button className="action-btn primary" onClick={handleRunTests}>
                Run Tests
              </button>
            </div>
          </div>
          
          <div className="code-editor">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="code-textarea"
              spellCheck="false"
            />
          </div>

          <div className="test-results">
            <div className="results-header">
              <h3>Test Results</h3>
              {testResults.length > 0 && (
                <span className="results-summary">
                  {testResults.filter(r => r.passed).length}/{testResults.length} Passed
                </span>
              )}
            </div>
            
            <div className="results-content">
              {testResults.length === 0 ? (
                <p className="no-results">Run tests to see results</p>
              ) : (
                testResults.map(result => (
                  <div key={result.id} className={`test-case ${result.passed ? 'passed' : 'failed'}`}>
                    <div className="test-header">
                      <span className="test-status">
                        {result.passed ? '✅' : '❌'} Test Case {result.id}
                      </span>
                    </div>
                    <div className="test-details">
                      <p><strong>Input:</strong> {result.input}</p>
                      <p><strong>Expected:</strong> {result.expected}</p>
                      <p><strong>Actual:</strong> {result.actual}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodingInterviewPage;
