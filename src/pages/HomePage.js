import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  return (
    <div className="home-container">
      <div className="section-group">
        <div className="section-column">
          <section className="info-section">
            <h1>Вероятностные структуры данных</h1>
            <p className="section-text">Вероятностные структуры данных предназначены как для обработки больших объемов данных в режиме 
            реального времени за счет компромисса между точностью ответа и эффективностью по затрачиваемой памяти, так и для улучшения 
            амортизированной оценки временной сложности исполнения операций структуры.</p>
            <p className="section-text">Известно множество вероятностных структур данных. Это целый отдельный подход к разработке 
            алгоритмов, заключающийся в допущении вероятности корректного ответа "w.h.p." (with high probability), что позволяет 
            минимизировать количество необходимых вычислительных ресурсов, но допускает небольшую вероятность получения неверного 
            ответа при определенных обстоятельствах. </p>
          </section>
          <section className="info-section">
            <h2>О приложении</h2>
            <p className="section-text">Сервис, на главной странице которого Вы находитесь, создан для ознакомления с существующими 
            структурами и подходами. Здесь также представлены теоретические выкладки об алгоритмах, принципах их работы и особенностях. 
            Вишенкой этого проекта является возможность интерактивного взаимодействия с вероятностными структурами данных. Реализуемый 
            функционал предназначен не для эмуляции поведения реально применяемых структур данных с тысячами элементов, а для изучения 
            принципов их работы на небольшом количестве объектов.</p>
            <p className="section-text">На текущий момент разработки (апрель 2024) реализованы Bloom Filter, Count-Min Sketch, 
            Skip List. Проект непременно будет продолжать своё развитие!</p>
          </section>
        </div>
        <div className="section-column datastructure-column">
          <div className="structure-item info-section">
            <img src="/bloom-filter.png" alt="Bloom Filter" />
            <Link to="/bloom-filter" className="button">Bloom Filter</Link>
          </div>
          <div className="structure-item info-section">
            <img src="/count-min-sketch.png" alt="Count-Min Sketch" />
            <Link to="/count-min-sketch" className="button">Count-Min Sketch</Link>
          </div>
          <div className="structure-item">
            <img src="/skip-list.png" alt="Skip List" />
            <Link to="/skip-list" className="button">Skip List</Link>
          </div>
        </div>
      </div>
      <div className="section-group">
        <h1>Удачи с изучением!</h1>
      </div>
    </div>
  );
}

export default HomePage;
