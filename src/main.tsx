import {Component,type ReactNode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App';
import './styles.css';
import './v4.css';
class Boundary extends Component<{children:ReactNode},{failed:boolean}>{state={failed:false};static getDerivedStateFromError(){return {failed:true};}render(){return this.state.failed?<main className="card"><h1>Let’s get back on track.</h1><p>A page error occurred. Your saved progress is still in browser storage.</p><button onClick={()=>{location.hash='#/home';location.reload();}}>Reload Python Lab</button></main>:this.props.children;}}
createRoot(document.getElementById('root')!).render(<Boundary><App/></Boundary>);
