import React, { Component } from 'react';
import './App.css';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.css';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      formData: {
        Recency: 1,
        Frequency: 1,
        Monetary: 1
      },
      result: ""
    };
  }

  handleChange = (event) => {
    const value = event.target.value;
    const name = event.target.name;
    var formData = this.state.formData;
    formData[name] = value;
    this.setState({
      formData
    });
  }

  handlePredictClick = (event) => {
    const formData = this.state.formData;
    this.setState({ isLoading: true });
    fetch('http://127.0.0.1:5000/prediction/', 
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(formData)
      })
      .then(response => response.json())
      .then(response => {
        this.setState({
          result: response.result,
          isLoading: false
        });
      });
  }

  handleCancelClick = (event) => {
    this.setState({ result: "" });
  }

  render() {
    const isLoading = this.state.isLoading;
    const formData = this.state.formData;
    const result = this.state.result;

    var Recency = []
    for (var i = 0; i <= 1000; i = +(i + 1).toFixed(1)) {
      Recency.push(<option key = {i} value = {i}>{i}</option>);
      }
  
    var Frequency = []
    for (var i = 0; i <= 1000; i = +(i + 1).toFixed(1)) {
      Frequency.push(<option key = {i} value = {i}>{i}</option>);
    }
   
    var Monetary = []
    for (var i = 1; i <= 1000; i = +(i + 1).toFixed(1)){
      Monetary.push(<option key = {i} value = {i}>{i}</option>);
    }
  
    return (
      <Container>
        <div>
          <h1 className="title">Loyalty Predictor</h1>
        </div>
        <div className="content">
          <Form>
            <Form.Row>
              <Form.Group as={Col}>
                <Form.Label>Recency</Form.Label>
                <Form.Control 
                  as="select"
                  value={formData.Recency}
                  name="Recency"
                  onChange={this.handleChange}>
                  {Recency}
                </Form.Control>
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Frequency</Form.Label>
                <Form.Control 
                  as="select"
                  value={formData.Frequency}
                  name="Frequency"
                  onChange={this.handleChange}>
                  {Frequency}
                </Form.Control>
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col}>
                <Form.Label>Monetary</Form.Label>
                <Form.Control 
                  as="select"
                  value={formData.Monetary}
                  name="Monetary"
                  onChange={this.handleChange}>
                  {Monetary}
                </Form.Control>
              </Form.Group>
            </Form.Row>
            <Row>
              <Col>
                <Button
                  block
                  variant="success"
                  disabled={isLoading}
                  onClick={!isLoading ? this.handlePredictClick : null}>
                  { isLoading ? 'Making prediction' : 'Predict' }
                </Button>
              </Col>
              <Col>
                <Button
                  block
                  variant="danger"
                  disabled={isLoading}
                  onClick={this.handleCancelClick}>
                  Reset prediction
                </Button>
              </Col>
            </Row>
          </Form>
          {result === "" ? null :
            (<Row>
              <Col className="result-container">
                <h5 id="result">{result}</h5>
              </Col>
            </Row>)
          }
        </div>
      </Container>
    );
  }
}

export default App;