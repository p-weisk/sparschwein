import React from 'react';
import { 
    Link
} from 'react-router-dom';
import {
    Alert,
    ButtonGroup,
    Col,
    Jumbotron,
    Row,
    Spinner
} from 'reactstrap';
import Money from './Money';
  

const Home = (props) => {
    const data = (props) => {
        if (props.loadingStatus === "loading") {
            return <Spinner color="primary" />
        }
        if (props.loadingStatus === "success") {
            return <p className="lead">In der aktuellen Abrechnungsperiode haben wir ein Budget von <Money amount={props.budget} currency="€" /> und bisher Ausgaben von <Money amount={props.spent} currency="€" />.</p>
        } else {
            return <Alert color="danger">Ein Fehler ist beim Laden der Daten aufgetreten</Alert>
        }
      }


    return (
        <Row>
          <Col>
            <Jumbotron>
                <h1 className="display-4">Unsere Haushalts&shy;kasse</h1>
                {
                    data(props)
                }
                <hr className="my-2" />
                <p>Schaue dir die Abrechnungsperioden mit Einkäufen oder eine chronologische Liste aller Einkäufe an:</p>
                <div className="lead">
                    <ButtonGroup>
                        <Link to="/periods" className="btn btn-outline-primary">Perioden</Link>
                        <Link to="/purchases" className="btn btn-outline-primary">Einkäufe</Link>
                    </ButtonGroup>
                </div>
            </Jumbotron>
          </Col>
        </Row>
    );
  }
  
  export default Home;