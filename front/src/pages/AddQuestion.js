import React from 'react'
import '../styles/normalize.css'
import '../styles/addQuestion.css'

function AddQuestion() {
  return (
    <div className='addQuestion__container'>
      <h1>Add question</h1>
      <div className='grid__inputs'>
        <div>
          Title:<input type="text" className=""></input><br></br>
          Hint:<input type="text" className=""></input>
        </div>
        <div>
          Statement: <input type="text" className="statement"></input>
        </div>
        <div>
          INPUTS
          <div>
            <input type="text" className=""></input>
          </div>
        </div>
        <div>
          OUTPUTS<input type="text" className=""></input>
        </div>
        <br></br>
        <input type='checkbox'></input> Set public
      </div>
    </div>
  )
}

export default AddQuestion
