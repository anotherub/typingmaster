import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import { Container, Row, Col, Card, Button } from 'react-bootstrap'
var randomWords = require('random-words')
const wordlist = randomWords(1000)

const index = () => {
  const [ isTypingStarted, setIsTypingStarted ] = useState(false)
  const [ currentWordIndex, setCurrentWordIndex ] = useState(0)
  const [ currentWordLength, setcurrentWordLength ] = useState(0)
  const [ currentWord, setCurrentWord ] = useState('')
  const [ correctWords, setCorrectWords ] = useState(0)
  const [ incorrectWords, setinCorrectWords ] = useState(0)
  const [ keyStroke, setKeyStroke ] = useState(0)
  const [ timer, setTimer ] = useState(60)
  const [ isTimeup, setisTimeup ] = useState(false)
  const [ padding, setpadding ] = useState(0)
  const [ inputdisable, setInputdisable ] = useState(false)
  const playAgainHandler = () => {
    window.location.reload(true)
  }

  const start = (event) => {
    if (!inputdisable) {
      if (currentWordIndex >= wordlist.length) {
        setInputdisable(true)
        return
      }
      if (!isTypingStarted) {
        console.log('time started')
        setIsTypingStarted(true)
        setTimeout(() => {
          setisTimeup(true)
          setIsTypingStarted(false)
        }, timer * 1000)
        setInterval(() => {
          setTimer((timer) => {
            if (timer !== 0) {
              return timer - 1
            } else return 0
          })
        }, 1000)
      }

      setKeyStroke(keyStroke + 1)
      const targetValue = event.target.value
      setCurrentWord(targetValue)
      const element = document.getElementById(`wordnumber${currentWordIndex}`)
      const nextelement = document.getElementById(`wordnumber${currentWordIndex + 1}`)
      const currentelementBoundary = element.getBoundingClientRect()
      const nextelementBoundary = nextelement ? nextelement.getBoundingClientRect() : null
      const elementText = element.innerText + ' '
      if (targetValue == elementText) {
        element.setAttribute('class', 'inputs correct')
        const nextadjointelement = document.getElementById(`wordnumber${currentWordIndex + 1}`)
        nextadjointelement.setAttribute('class', 'inputs highlight')
        setCurrentWord('')
        setCurrentWordIndex(currentWordIndex + 1)
        setCorrectWords(correctWords + 1)
        setcurrentWordLength(currentWordLength + targetValue.length)
        console.log('Matched', targetValue)
      } else if (elementText.substring(0, targetValue.length) == targetValue) {
        element.setAttribute('class', 'inputs highlight')
      } else {
        element.setAttribute('class', 'inputs highlight-wrong')
      }
      if (targetValue[targetValue.length - 1] == ' ' && targetValue !== elementText) {
        element.setAttribute('class', 'inputs wrong')
        setCurrentWord('')
        setCurrentWordIndex(currentWordIndex + 1)
        const nextelement = document.getElementById(`wordnumber${currentWordIndex + 1}`)
        if (nextelement) nextelement.setAttribute('class', 'inputs highlight')
        setinCorrectWords(incorrectWords + 1)
      }
      if (
        targetValue[targetValue.length - 1] == ' ' &&
        nextelementBoundary &&
        currentelementBoundary &&
        nextelementBoundary.top - currentelementBoundary.top > 0
      ) {
        console.log('sliding')
        setpadding(padding - 55)
        if (padding == 0) {
          document.getElementById('row1').style.top = '-55px'
        } else {
          document.getElementById('row1').style.top = `${padding - 55}px`
        }
      }
    }
  }
  return (
    <React.Fragment>
      <link href="/static/design.css" rel="stylesheet" />
      <Container className="main">
        <div className="insideContainer">
          <Row>
            <div id="words" className="row">
              <div id="row1">
                {wordlist.map((item, index) => (
                  <span key={index} className="inputs" id={`wordnumber${index}`}>
                    {wordlist[index]}
                  </span>
                ))}
              </div>
            </div>
          </Row>

          <Row>
            <div
              id="input-row"
              className="row"
              style={{
                backgroundColor: '#A7C8E7',
                display: 'flex',
                width: 'auto',
                borderRadius: '5px',
                padding: '10px 25%'
              }}
            >
              <Col lg={8} md={8} sm={9} xs={8}>
                <input
                  type="text"
                  style={{
                    fontFamily: 'Times New Roman, Times, serif',
                    fontSize: '2.2em',
                    lineHeight: '1.2em',
                    borderRadius: '8px',
                    width: '100%',
                    alignItems: 'center',
                    marginTop: '3px',
                    minWidth: '100px',
                    display: 'flex',
                    float: 'right'
                  }}
                  onChange={start}
                  disabled={isTimeup || inputdisable}
                  value={currentWord}
                  spellCheck={false}
                  autoComplete="off"
                  autoCapitalize="false"
                />
              </Col>
              <Col
                lg={4}
                md={4}
                sm={3}
                xs={4}
                style={{
                  fontFamily: 'Times New Roman, Times, serif',
                  fontSize: '2.2em',
                  lineHeight: '1em',
                  color: '#2196f3',
                  backgroundColor: '#3C4D5C',
                  borderRadius: '10px',
                  display: 'flex',
                  float: 'right',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: '10px',
                  padding: '0 5px',
                  width: 'inherit'
                }}
              >
                {Math.floor(timer / 60)}:{`${timer - 60 * Math.floor(timer / 60)}`.length < 2 ? (
                  '0' + (timer - 60 * Math.floor(timer / 60))
                ) : (
                  timer - 60 * Math.floor(timer / 60)
                )}
              </Col>
            </div>
          </Row>
          <Row>
            <div id="result">
              {isTimeup && (
                <Card
                  style={{
                    backgroundColor: 'white',
                    marginTop: '20px',
                    display: 'relative',
                    padding: '10px 10px',
                    borderRadius: '5px'
                  }}
                >
                  <Card.Body>
                    <Card.Title style={{ color: '#47A447' }}>
                      <h1>Result:{Math.floor(keyStroke / 5)}WPM</h1>
                    </Card.Title>
                    <Card.Text>
                      KeyStrokes:<span style={{ color: '#000000' }}> {keyStroke}</span>
                      <br />
                      Correct Words:<span style={{ color: '#008000' }}>
                        {' '}
                        {Math.floor(currentWordLength / 4).toFixed(2)}
                      </span>
                      <br />
                      Incorrect Words:<span style={{ color: '#ff0000' }}>
                        {' '}
                        {Math.floor((keyStroke - currentWordLength) / 4).toFixed(2)}
                      </span>
                      <br />
                      Accuracy:{(currentWordLength / (keyStroke - currentWord.length) * 100).toFixed(2)}%
                    </Card.Text>
                  </Card.Body>
                  <Button
                    style={{ color: '#47A447', position: 'relative', left: '70px', bottom: '0px' }}
                    variant="primary"
                    onClick={playAgainHandler}
                  >
                    Play Again
                  </Button>
                </Card>
              )}
            </div>
          </Row>
        </div>
      </Container>
      <div className="footer">
        <div className="footercontent">Made by Umesh Bhat</div>
      </div>
    </React.Fragment>
  )
}
export default index
// function About() {
//   return <div>About</div>
// }

// export default About
