
import React, {Component, useState} from 'react'
import {FaCircle} from 'react-icons/fa'
import '../App.css'
function Question({ question , onAnswerClick, displayAnswer}) {
    let body = !displayAnswer ? (
      <div
        onClick={onAnswerClick}
        className="Question-text"
      >
        {question.text}
      </div>
    ) : (
      <div className="Question-answer">
        <div className="Question-answer-question"> {question.text}</div>
        <div className="Question-answer-text capitalize">{question.answer}</div>
      </div>
    );
    return (
        <div className="Question"> 
            <div className='Question-container'>
                { body }
            </div>
            <QuestionFooter question={question}/>
        </div>
    )
}

function QuestionFooter({question}) {
    return (
        <div className='QuestionFooter' style={{ 'backgroundColor': question.category.color }}>
            
            <PointsDisplay points={question.value} />
            <div className='Category'>
                <div>{question.category.title}</div>
                <div className='Category-details'>{question.category.details}</div>
            </div>
        </div>
    )
}

class PointsDisplay extends Component {
    constructor(props) {
        super(props);
        console.log(this.props);

    }

    render() {
        let circles = []
        for(let i = 0; i < this.props.points; ++i ) {
            circles.push(<FaCircle/>)
        }
        return (
            <div className='PointsDisplay'>
                <div className='PointsDisplay-container'>
                {
                    circles
                }
                </div>
            </div>
        )
    }
}

export default Question;