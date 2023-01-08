import { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import LayoutDefault from './components/layouts/DefaultLayout';
import CourseDetail from './pages/courseDetail';
import routes from './pages/routes';

function App() {
  return (
    <Router>
      <LayoutDefault>
      <Suspense fallback={<div></div>}>
        <Routes>
          {[
            <Route element = {<CourseDetail />} key={'course-detail'} path = {"/course/chi-tiet-khoa-hoc/:slug"} />
            ,...routes.map(({component : Component, path,label, ...rest}, index) => {
              return (
                <Route element = {<Component />} key={index} path = {path} {...rest}/>
              )
            })
          ]}
        </Routes>
        </Suspense>
      </LayoutDefault>
    </Router>
  );
}

export default App;
