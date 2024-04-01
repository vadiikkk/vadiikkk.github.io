import React, { useState, useEffect } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import CountMinSketch from '../structures/CountMinSketch';
import './CountMinSketchPage.css'

function CountMinSketchPage() {
  const [table, setTable] = useState(null);

  const [width, setWidth] = useState('15');
  const [height, setHeight] = useState('3');
  const [epsilon, setEpsilon] = useState('0.2');
  const [delta, setDelta] = useState('0.05');

  const [insertInput, setInsertInput] = useState('');
  const [countInput, setCountInput] = useState('');

  const [countMessage, setCountMessage] = useState(null);
  const [realCountMessage, setRealCountMessage] = useState(null);
  const [highlightedIndices, setHighlightedIndices] = useState([]);

  const [codeString, setCodeString] = useState('');

  useEffect(() => {
    fetch('/CountMinSketch.js')
      .then((response) => response.text())
      .then((text) => {
        setCodeString(text);
      });
  }, []);

  const initializeTableWithDimensions = () => {
    const countMinSketch = new CountMinSketch({ 'rowsNumber': parseInt(height, 10), 'colsNumber': parseInt(width, 10) });
    setTable(countMinSketch);
  };

  const initializeTableWithAccuracy = () => {
    const countMinSketch = new CountMinSketch({ 'epsilon': parseFloat(epsilon), 'delta': parseFloat(delta) });
    setTable(countMinSketch);
  };

  const handleInsertAction = (e) => {
    if (e.key === 'Enter' && insertInput) {
      const indices = table.getHashIndices(parseInt(insertInput, 10));
      setHighlightedIndices(indices);
      setTimeout(() => setHighlightedIndices([]), 1000);

      table.add(parseInt(insertInput, 10));
      setInsertInput('');
    }
  };

  const handleCountAction = (e) => {
    if (e.key === 'Enter' && countInput) {
      const indices = table.getHashIndices(parseInt(countInput, 10));
      setHighlightedIndices(indices);
      setTimeout(() => setHighlightedIndices([]), 2000);

      const found = table.count(parseInt(countInput, 10));
      const real = table.realObjects.filter(x => x === parseInt(countInput, 10)).length;

      if (found !== real) {
        setCountMessage({ text: found, color: '#f44336' });
        setTimeout(() => setCountMessage(null), 2000);

      } else {
        setCountMessage({ text: found, color: 'green' });
        setTimeout(() => setCountMessage(null), 2000);
      }

      setRealCountMessage({ text: real, color: 'white' });
      setTimeout(() => setRealCountMessage(null), 2000);

      setCountInput('');
    }
  };

  return (
    <div>
      {!table && (
        <div className="container">
          <div className="title">Выберите способ инициализации</div>
          <div className="init-container">
            <div className="half-section">
              <label>Высота таблицы: {height}</label>
              <input
                type="range"
                min="2"
                max="4"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
              <label>Ширина таблицы: {width}</label>
              <input
                type="range"
                min="5"
                max="30"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
              />
              <button className="init-button" onClick={initializeTableWithDimensions}>Инициализировать</button>
            </div>
            <div className="half-section">
              <label>Максимальная ошибка: {epsilon}</label>
              <input
                type="range"
                min="0.1"
                max="0.6"
                step="0.02"
                value={epsilon}
                onChange={(e) => setEpsilon(e.target.value)}
              />
              <label>Вероятность ее превышения: {delta}</label>
              <input
                type="range"
                min="0.02"
                max="0.3"
                step="0.01"
                value={delta}
                onChange={(e) => setDelta(e.target.value)}
              />
              <button className="init-button" onClick={initializeTableWithAccuracy}>Инициализировать</button>
            </div>
          </div>
        </div>
      )}
      {table && (
        <div className="filter-container">
          <div className="bit-vector-container">
            <div className="bit-indexess">
              {table.table[0].map((_, index) => (
                <span key={index} className={`bit-index`}>{index}</span>
              ))}
            </div>
            {table.table.map((row, rowIndex) => (
              <div key={rowIndex} className="sketch-row">
                <span className="row-header">h{rowIndex + 1}</span>
                {row.map((cell, cellIndex) => (
                  <span key={cellIndex} className={`bit ${cell !== 0 ? 'set' : 'unset'} 
                  ${highlightedIndices[rowIndex] === cellIndex ? 'highlight' : ''}`}>
                    {cell}
                  </span>
                ))}
              </div>
            ))}
          </div>
          {countMessage && (
            <div style={{ color: countMessage.color, marginTop: 10 }}>
              Ответ: {countMessage.text}
            </div>
          )}
          {countMessage && (
            <div style={{ color: countMessage.white }}>
              Реальное количество элементов {realCountMessage.text}
            </div>
          )}
          <div className="actions">
            <div className="action-group">
              <label>Insert:</label>
              <input
                type="number"
                placeholder="Элемент для добавления"
                className="action-input"
                value={insertInput}
                onChange={(e) => setInsertInput(e.target.value)}
                onKeyDown={handleInsertAction}
              />
            </div>
            <div className="action-group">
              <label>Count:</label>
              <input
                type="number"
                placeholder="Элемент для поиска"
                className="action-input"
                value={countInput}
                onChange={(e) => setCountInput(e.target.value)}
                onKeyDown={handleCountAction}
              />
            </div>
          </div>
          <span>Нажмите Enter для применения операции.</span>
          <div className="real-objects">
            <h3>Вставленные элементы:</h3>
            <div className="items-row">
              {[...table.realObjects].map((item, index) => (
                <span key={index}>{item}</span>
              ))}
            </div>
          </div>
          <div className="statistics">
            <p>Высота таблицы (Количество хеш-функций): {table.rowsNumber}</p>
            <p>Ширина таблицы (Размер векторов): {table.colsNumber}</p>
            <p>Максимально возможная ошибка: {table.epsilon.toFixed(2)}</p>
            <p>Вероятность превышения величины ошибки: {table.delta.toFixed(2)}</p>
          </div>
          <button className="init-button" onClick={() => setTable(null)}>Reset</button>
        </div>
      )}
      <div className="home-container">
        <div className="section-group">
          <div className="section-column">
            <section className="info-section">
              <h1>
                Как использовать?
              </h1>
              <p className="section-text">
                Прежде всего нужно выбрать способ инициализации структуры: с помощью высоты и ширины таблицы
                (эквивалентно количеству хеш-функций и размеру векторов) или с помощью максимальной ошибки и вероятности её превышения.
                Точность определяет максимальную ожидаемую ошибку подсчёта. Например, если точность 
                равна 0.01, это означает, что ошибка подсчёта для любого элемента не должна
                превысить 1% от общего числа элементов. Вероятность гарантирует, что указанная точность будет достигнута с
                вероятностью, превышающей 1 - δ. Например, если вероятность равна 0.01, это означает, что с вероятностью
                99% ошибка не превысит заданную границу.
              </p>
              <p className="section-text">
                После инициализации к структуре можно применять операции вставки и подсчета. Для этого нужно ввести значение в
                соответствующее поле для ввода и нажать Enter
              </p>
            </section>
          </div>
          <div className="section-column">
            <section className="info-section">
              <h1>
                Про структуру
              </h1>
              <p className="section-text">
                Count-Min Sketch — это простая, но мощная вероятностная структура данных, используемая для аппроксимации 
                частоты элементов в потоках данных. Это особенно полезно в ситуациях, где прямой подсчёт частот может потребовать 
                слишком много памяти или времени. В основе Count-Min Sketch лежит идея использования нескольких хеш-функций и таблицы 
                счётчиков для оценки частоты элементов.
              </p>
              <p className="section-text">
                Count-Min Sketch широко применяется для анализа больших потоков данных в реальном времени, таких как сетевой трафик, 
                распределение слов в больших текстовых корпусах и подсчёт уникальных посетителей на веб-сайтах. Благодаря своей 
                способности аппроксимировать частоты с ограниченным использованием памяти, Count-Min Sketch находит применение в 
                системах, где требуется высокая производительность и масштабируемость.
              </p>
            </section>
          </div>
        </div>
        <div >
          <div>
            <h2>
              Как работает Count-Min Sketch?
            </h2>
            <h3>
              Инициализация:
            </h3>
            <p>
              Count-Min Sketch состоит из двумерного массива (таблицы) счётчиков и нескольких хеш-функций. Количество строк в этой 
              таблице соответствует количеству хеш-функций, а количество столбцов зависит от требуемой точности аппроксимации. При 
              создании Count-Min Sketch определяются его размеры — количество хеш-функций (глубина) и ширина таблицы. Большее 
              количество хеш-функций и ширина таблицы уменьшают вероятность ошибки в оценке частоты элементов, но требуют больше памяти.
            </p>
            <h3>
              Вставка:
            </h3>
            <p>
              Чтобы добавить элемент, его хешируют каждой из хеш-функций. Каждое хеш-значение указывает на столбец в соответствующей 
              строке таблицы, и счётчик в этой ячейке увеличивается на один. Таким образом, каждый элемент вносит вклад в увеличение 
              счётчиков в различных местах таблицы.
            </p>
            <h3>
              Поиск:
            </h3>
            <p>
              Чтобы оценить частоту элемента, его снова хешируют теми же хеш-функциями, и из таблицы выбираются счётчики по указанным 
              столбцам в каждой строке. Минимальное из этих значений считается аппроксимацией частоты элемента. Это минимальное 
              значение является оценкой сверху, поскольку коллизии хеш-функций могут привести к тому, что счётчики будут увеличены 
              из-за других элементов.
            </p>
          </div>
          <div>
            <h2>
              Формулы
            </h2>
            <p>
              Высота (d) и ширина (w) таблицы вычисляются по следующим формулам ((e) - число 
              Эйлера): <InlineMath math={'w = \\lceil e / \\epsilon\\rceil'} />, <InlineMath math={'d = \\lceil \\ln{1 / \\delta} \\rceil'} />
            </p>
          </div>
        </div>
        <div>
          <h2>
            Имплементация
          </h2>
          <SyntaxHighlighter language="javascript" style={dracula}>
            {codeString}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
}

export default CountMinSketchPage;