import React, { useState, useEffect } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import BloomFilter from '../structures/BloomFilter';
import './BloomFilterPage.css'

function BloomFilterPage() {
  const [filter, setFilter] = useState(null);

  const [bitVectorSize, setBitVectorSize] = useState('15');
  const [hashNumber, setHashNumber] = useState('3');
  const [itemCountForSize, setItemCountForSize] = useState('4');
  const [itemCountForHash, setItemCountForHash] = useState('6');
  const [maxItemCount, setMaxItemCount] = useState('6');

  const [insertInput, setInsertInput] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const [searchMessage, setSearchMessage] = useState(null);
  const [highlightedIndices, setHighlightedIndices] = useState([]);

  const [codeString, setCodeString] = useState('');

  useEffect(() => {
    fetch('/BloomFilter.js')
      .then((response) => response.text())
      .then((text) => {
        setCodeString(text);
      });
  }, []);

  useEffect(() => {
    switch (hashNumber) {
      case '2':
        setMaxItemCount(10);
        break;
      case '3':
        setMaxItemCount(6);
        break;
      case '4':
        setMaxItemCount(5);
        break;
      default:
        setMaxItemCount(10);
    }
  }, [hashNumber]);

  useEffect(() => {
    if (itemCountForHash > maxItemCount) {
      setItemCountForHash(maxItemCount);
    }
  }, [maxItemCount, itemCountForHash]);

  const initializeFilterWithVectorSize = () => {
    const bloomFilter = new BloomFilter({ 'bitVectorSize': parseInt(bitVectorSize, 10), 'itemNumber': parseInt(itemCountForSize, 10) });
    setFilter(bloomFilter);
  };

  const initializeFilterWithHashFunctions = () => {
    const bloomFilter = new BloomFilter({ 'hashNumber': parseInt(hashNumber, 10), 'itemNumber': parseInt(itemCountForHash, 10) });
    setFilter(bloomFilter);
  };

  const handleInsertAction = (e) => {
    if (e.key === 'Enter' && insertInput) {
      const indices = filter.getHashIndices(parseInt(insertInput, 10));
      setHighlightedIndices(indices);
      setTimeout(() => setHighlightedIndices([]), 1000);

      filter.add(parseInt(insertInput, 10));
      setInsertInput('');
    }
  };

  const handleSearchAction = (e) => {
    if (e.key === 'Enter' && searchInput) {
      const indices = filter.getHashIndices(parseInt(searchInput, 10));
      setHighlightedIndices(indices);
      setTimeout(() => setHighlightedIndices([]), 1000);

      const found = filter.verify(parseInt(searchInput, 10));
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

  return (
    <div>
      {!filter && (
        <div className="container">
          <div className="title">Выберите способ инициализации</div>
          <div className="init-container">
            <div className="half-section">
              <label>Размер битового вектора: {bitVectorSize}</label>
              <input
                type="range"
                min="5"
                max="30"
                value={bitVectorSize}
                onChange={(e) => setBitVectorSize(e.target.value)}
              />
              <label>Количество элементов: {itemCountForSize}</label>
              <input
                type="range"
                min="1"
                max="10"
                value={itemCountForSize}
                onChange={(e) => setItemCountForSize(e.target.value)}
              />
              <button className="init-button" onClick={initializeFilterWithVectorSize}>Инициализировать</button>
            </div>
            <div className="half-section">
              <label>Количество хеш-функций: {hashNumber}</label>
              <input
                type="range"
                min="2"
                max="4"
                value={hashNumber}
                onChange={(e) => setHashNumber(e.target.value)}
              />
              <label>Количество элементов: {itemCountForHash}</label>
              <input
                type="range"
                min="1"
                max={maxItemCount}
                value={itemCountForHash}
                onChange={(e) => setItemCountForHash(e.target.value)}
              />
              <button className="init-button" onClick={initializeFilterWithHashFunctions}>Инициализировать</button>
            </div>
          </div>
        </div>
      )}
      {filter && (
        <div className="filter-container">
          <div className="bit-vector-container">
            <div className="bit-indexes">
              {filter.filter.map((_, index) => (
                <span key={index} className={`bit-index ${highlightedIndices.includes(index) ? 'highlight' : ''}`}>{index}</span>
              ))}
            </div>
            <div className="bit-vector">
              {filter.filter.map((bit, index) => (
                <span key={index} className={`bit ${bit ? 'set' : 'unset'}`}>{bit ? '1' : '0'}</span>
              ))}
            </div>
          </div>
          {searchMessage && (
            <div style={{ color: searchMessage.color }}>
              {searchMessage.text}
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
          </div>
          <span>Нажмите Enter для применения операции.</span>
          <div className="real-objects">
            <h3>Вставленные элементы:</h3>
            <div className="items-row">
              {[...filter.realObjects].map((item, index) => (
                <span key={index}>{item}</span>
              ))}
            </div>
          </div>
          <div className="statistics">
            <p>Размер битового вектора: {filter.bitVectorSize}</p>
            <p>Количество хеш-функций: {filter.hashNumber}</p>
            <p>Ожидаемое количество элементов в фильтре: {filter.itemNumber}</p>
            <p className={filter.realObjects.size > filter.itemNumber ? 'text-danger' : ''}>
              Вероятность ложно-положительного срабатывания: {filter.getFalsePositive().toFixed(4)}
            </p>
            {filter.isFull() && (
              <p className="text-warning">
                Внимание: фильтр полностью заполнен и непригоден для использования. Пожалуйста, пересоздайте его.
              </p>
            )}
          </div>
          <button className="init-button" onClick={() => setFilter(null)}>Reset</button>
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
                Прежде всего нужно выбрать способ инициализации фильтра: с помощью размера битового вектора или с помощью количества
                используемых хеш-функций. Обратите внимание - в обоих случаях необходимо также ввести количество элементов, которые вы
                собираетесь добавлять в фильтр. При достижении этого количества, фильтр не завершит свою работу, однако вероятность
                ложно-положительного срабатывания будет чрезмерно большой - об этом выдастся уведомление. При полной заполненности
                фильтра он становится непригодным для определения принадлежности элементов.
              </p>
              <p className="section-text">
                После инициализации к фильтру можно применять операции вставки и поиска. Для этого нужно ввести значение в
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
                Bloom Filter — это эффективная вероятностная структура данных, позволяющая проверить, содержит ли набор элементов
                какой-либо конкретный элемент. Основная идея заключается в том, что Bloom Filter может сказать либо "элемент возможно
                есть в наборе", либо "элемента точно нет в наборе". Такая вероятностная природа означает, что Bloom Filter может давать
                ложноположительные результаты (сказать, что элемент есть в наборе, когда его там нет), но никогда не даст
                ложноотрицательный результат (не скажет, что элемента нет, если он есть).
              </p>
              <p className="section-text">
                Bloom Filter прекрасно подходит для задач, где допустимы ложноположительные результаты и критично важно экономить
                память, например, при фильтрации веб-страниц в поисковых системах или проверке наличия слов в тексте.
              </p>
            </section>
          </div>
        </div>
        <div >
          <div>
            <h2>
              Как работает Bloom Filter?
            </h2>
            <h3>
              Инициализация:
            </h3>
            <p>
              Сначала создаётся битовый массив (последовательность нулей и единиц) фиксированного размера, инициализированный нулями.
              Также выбирается несколько хеш-функций, которые будут использоваться для работы фильтра.
            </p>
            <h3>
              Вставка:
            </h3>
            <p>
              Когда элемент добавляется в фильтр, он сначала обрабатывается каждой из хеш-функций, которые возвращают индексы в битовом
              массиве. По этим индексам в массиве устанавливаются единицы.
            </p>
            <h3>
              Поиск:
            </h3>
            <p>
              Чтобы проверить, содержится ли элемент в фильтре, его также обрабатывают теми же хеш-функциями. Если в битовом массиве по
              всем полученным индексам стоят единицы, фильтр сообщает, что элемент возможно есть в наборе. Если хотя бы по одному
              индексу стоит ноль — элемента точно нет.
            </p>
          </div>
          <div>
            <h2>
              Формулы
            </h2>
            <p>
              Вероятность ложноположительного результата (P) зависит от размера битового массива (m),
              количества элементов в фильтре (n) и количества хеш-функций (k).
              Она может быть приблизительно вычислена по формуле: <InlineMath math={'P \\approx (1 - e^{-\\frac{kn}{m}}))^k'} />
            </p>
            <p>
              Оптимальное количество хеш-функций для минимизации вероятности ложноположительных
              результатов можно найти по следующей формуле: <InlineMath math={'k = \\frac{m}{n}\\ln{2}'} />
            </p>
            <p>
              Теоретическая оценка трубемой памяти вычисляется по формуле: <InlineMath math={'m = 1.44n\\log_2{\\frac{1}{e}} = 1.44nk'} />
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

export default BloomFilterPage;