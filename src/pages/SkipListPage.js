import React, { useState, useEffect } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import 'katex/dist/katex.min.css';
import './SkipListPage.css'
import SkipList from '../structures/SkipList';
import SkipListVisualization from './SkipListVisualization';

function SkipListPage() {
  const [list, setList] = useState(null);

  const [nextLevelProbability, setNextLevelProbability] = useState('0.5');
  const [maxLevel, setMaxLevel] = useState('5');

  const [insertInput, setInsertInput] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [deleteInput, setDeleteInput] = useState('');

  const [elementCount, setElementCount] = useState(0);

  const [insertWarningMessage, setInsertWarningMessage] = useState(null);
  const [insertMessage, setInsertMessage] = useState(null);
  const [searchMessage, setSearchMessage] = useState(null);

  const [codeString, setCodeString] = useState('');

  const MAX_ELEMENTS = 14;

  useEffect(() => {
    fetch('/SkipList.js')
      .then((response) => response.text())
      .then((text) => {
        setCodeString(text);
      });
  }, []);

  const initializeSkipList = () => {
    const skipList = new SkipList(parseFloat(nextLevelProbability), parseInt(maxLevel));
    setList(skipList);
    setInsertWarningMessage(null);
    setElementCount(0);
  };

  const handleInsertAction = (e) => {
    if (e.key === 'Enter' && insertInput && elementCount < MAX_ELEMENTS && !list.search(parseInt(insertInput, 10))) {
      const valueToInsert = parseInt(insertInput, 10);
      setElementCount(prevCount => prevCount + 1);
      const level = list.insert(valueToInsert);
      let mes = '';
      for (let i = 0; i < level; ++i) {
        mes += 'Орел -> ';
      }
      mes += 'Решка';
      console.log(mes);
      setInsertMessage({ text: mes });
      setTimeout(() => setInsertMessage(null), 2000);
      setInsertInput('');
    } else if (elementCount >= MAX_ELEMENTS) {
      setInsertWarningMessage({ text: 'Достигнуто максимальное количество элементов для комфортного отображения структуры.', color: 'orange' });
    } else if (e.key === 'Enter' && list.search(parseInt(insertInput, 10))) {
      setInsertInput('');
    }
  };

  const handleSearchAction = (e) => {
    if (e.key === 'Enter' && searchInput) {
      const found = list.search(parseInt(searchInput, 10));
      if (found) {
        setSearchMessage({ text: 'Элемент найден', color: 'green' });
        setTimeout(() => setSearchMessage(null), 1000);

      } else {
        setSearchMessage({ text: 'Элемент не найден', color: '#f44336' });
        setTimeout(() => setSearchMessage(null), 1000);
      }

      setSearchInput('');
    }
  };

  const handleDeleteAction = (e) => {
    if (e.key === 'Enter' && deleteInput) {
      list.remove(parseInt(deleteInput, 10));
      setElementCount(prevCount => prevCount - 1);
      if (elementCount <= MAX_ELEMENTS) {
        setInsertWarningMessage(null);
      }
      setDeleteInput('');
    }
  };

  return (
    <div>
      {!list && (
        <div className="container">
          <div className="init-containerr">
            <label>Вероятность перехода на следующий уровень: {nextLevelProbability}</label>
            <input
              type="range"
              min="0.05"
              max="0.95"
              step="0.05"
              value={nextLevelProbability}
              onChange={(e) => setNextLevelProbability(e.target.value)}
            />
            <label>Максимальное количество уровней: {maxLevel}</label>
            <input
              type="range"
              min="2"
              max="7"
              value={maxLevel}
              onChange={(e) => setMaxLevel(e.target.value)}
            />
            <button className="init-button" onClick={initializeSkipList}>Инициализировать</button>
          </div>
        </div>
      )}
      {list && (
        <div className="filter-container">
          <SkipListVisualization list={list} />
          {insertMessage && (
            <div style={{ color: 'green' }}>
              {insertMessage.text}
            </div>
          )}
          {searchMessage && (
            <div style={{ color: searchMessage.color }}>
              {searchMessage.text}
            </div>
          )}
          <div className="actions">
            {!insertWarningMessage && (
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
            )}
            {insertWarningMessage && (
              <div style={{ color: insertWarningMessage.color }}>
                {insertWarningMessage.text}
              </div>
            )}
            <div className="action-group">
              <label>Search:</label>
              <input
                type="number"
                placeholder="Элемент для поиска"
                className="action-input"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleSearchAction}
              />
            </div>
            <div className="action-group">
              <label>Delete:</label>
              <input
                type="number"
                placeholder="Элемент для удаления"
                className="action-input"
                value={deleteInput}
                onChange={(e) => setDeleteInput(e.target.value)}
                onKeyDown={handleDeleteAction}
              />
            </div>
          </div>
          <span>Нажмите Enter для применения операции.</span>
          <div className="statistics">
            <p>Максимальное количество уровней: {maxLevel}</p>
            <p>Вероятность перехода на следующий уровень: {nextLevelProbability}</p>
          </div>
          <button className="init-button" onClick={() => setList(null)}>Reset</button>
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
                Прежде всего нужно инициализировать структуру: задать вероятность перехода элемента на следующий уровень
                (можно оставить "Fair Сoin" - 1/2 или задать пользовательскую вероятность) и максимальное количество
                уровней в списке с пропусками.
              </p>
              <p className="section-text">
                После инициализации к списку можно применять операции вставки, поиска и удаления. Для этого нужно ввести
                значение в соответствующее поле для ввода и нажать Enter.
              </p>
            </section>
          </div>
          <div className="section-column">
            <section className="info-section">
              <h1>
                Про структуру
              </h1>
              <p className="section-text">
                Skip List — это вероятностная структура данных, которая позволяет эффективно выполнять операции поиска,
                вставки и удаления элементов. Она представляет собой набор связанных списков с разными уровнями, где каждый
                уровень является подмножеством уровня ниже. В Skip List элементы отсортированы по ключу, что позволяет быстро
                находить нужный элемент. Стохастическая природа алгоритма позволяет достигать амортизированных оценок скорости
                основных операций в O(log n).
              </p>
            </section>
          </div>
        </div>
        <div >
          <div>
            <h2>
              Как работает Skip List?
            </h2>
            <p className="section-text">
              Основной идеей Skip List является добавление дополнительных "пропусков" или ссылок, которые позволяют пропустить
              часть элементов при поиске, тем самым ускоряя его. В обычном связанном списке, чтобы найти элемент, вам может
              понадобиться пройти через каждый элемент по порядку. В Skip List вы можете быстро переходить на большие расстояния по
              списку, используя уровни с пропусками, и затем сужать поиск, спускаясь на уровни ниже.
            </p>
            <p>
              Skip List состоит из нескольких слоёв или уровней связанных списков. На нижнем уровне находятся все элементы. На уровнях
              выше располагаются пропуски (shortcuts), которые позволяют перескакивать через один или несколько элементов. Количество
              уровней и расстояние между пропусками определяются случайным образом с использованием вероятностного алгоритма.
            </p>
            <h3>
              Поиск:
            </h3>
            <p>
              Поиск начинается с самого верхнего уровня и перемещается вправо, пока следующий элемент не станет больше искомого
              или не будет достигнут конец списка. Тогда поиск спускается на один уровень ниже и продолжается. Когда поиск достигает
              нижнего уровня, он продолжается вправо до нахождения элемента или достижения ближайшего большего значения. Ожидаемое
              время выполнения операции поиска в Skip List составляет O(log n). Это достигается за счёт того,
              что каждый переход на уровень выше уменьшает область поиска в 1/p что позволяет эффективно пропускать большие
              сегменты списка.
            </p>
            <h3>
              Вставка:
            </h3>
            <p>
              Для вставки нового элемента сначала находится позиция для вставки на каждом уровне, как в процессе поиска.
              Затем элемент вставляется в список на нижнем уровне и, с определённой вероятностью, на более высоких уровнях.
              Операция вставки в Skip List также имеет ожидаемую асимптотику O(log n).
            </p>
            <h3>
              Удаление:
            </h3>
            <p>
              Операция удаления элемента из Skip List также имеет ожидаемое время выполнения O(log n).
              Алгоритм удаления аналогичен алгоритму вставки: сначала осуществляется поиск удаляемого элемента,
              затем элемент удаляется со всех уровней, на которых он присутствует.
            </p>
          </div>
          <div>
            <h2>
              Про асимптотику
            </h2>
            <p>
              Асимптотика основных операций в Skip List зависит от количества уровней и распределения узлов по этим уровням.
              Важно отметить, что описанные асимптотики являются ожидаемыми (амортизированными) значениями. В
              худшем случае, когда все элементы расположены последовательно на всех уровнях, время выполнения операций может
              достигать O(n). Однако вероятность такого сценария экстремально мала, и в среднем Skip List показывает
              логарифмическую сложность операций, что делает её эффективной структурой данных для многих практических применений.
            </p>
          </div>
        </div>
        <div>
          <h2>
            Имплементация
          </h2>
          <SyntaxHighlighter language="javascript" style={dracula}>
            {codeString}основные операции имеют следующую асимптотику:
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
}

export default SkipListPage;