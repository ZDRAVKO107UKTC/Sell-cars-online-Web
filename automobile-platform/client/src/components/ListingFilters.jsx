function ListingFilters({
  filters,
  makes,
  models,
  onChange,
  onSubmit,
  onReset,
}) {
  return (
    <form className="panel filters-panel" onSubmit={onSubmit}>
      <div className="panel-heading">
        <div>
          <h2>Филтри</h2>
          <span>Настрой търсенето като в автомобилен каталог</span>
        </div>
        <button className="button button--ghost" type="button" onClick={onReset}>
          Изчисти
        </button>
      </div>

      <div className="form-grid">
        <div className="field">
          <label htmlFor="make">Марка</label>
          <select id="make" name="make" value={filters.make} onChange={onChange}>
            <option value="">Всички</option>
            {makes.map((make) => (
              <option key={make} value={make}>
                {make}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="model">Модел</label>
          <select id="model" name="model" value={filters.model} onChange={onChange}>
            <option value="">Всички</option>
            {models.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="priceMin">Цена от</label>
          <input id="priceMin" name="priceMin" type="number" value={filters.priceMin} onChange={onChange} />
        </div>

        <div className="field">
          <label htmlFor="priceMax">Цена до</label>
          <input id="priceMax" name="priceMax" type="number" value={filters.priceMax} onChange={onChange} />
        </div>

        <div className="field">
          <label htmlFor="yearMin">Година от</label>
          <input id="yearMin" name="yearMin" type="number" value={filters.yearMin} onChange={onChange} />
        </div>

        <div className="field">
          <label htmlFor="yearMax">Година до</label>
          <input id="yearMax" name="yearMax" type="number" value={filters.yearMax} onChange={onChange} />
        </div>

        <div className="field">
          <label htmlFor="fuelType">Гориво</label>
          <select id="fuelType" name="fuelType" value={filters.fuelType} onChange={onChange}>
            <option value="">Всички</option>
            <option value="Petrol">Бензин</option>
            <option value="Diesel">Дизел</option>
            <option value="Hybrid">Хибрид</option>
            <option value="Electric">Електрически</option>
            <option value="LPG">Газ</option>
          </select>
        </div>

        <div className="field">
          <label htmlFor="transmission">Скоростна кутия</label>
          <select
            id="transmission"
            name="transmission"
            value={filters.transmission}
            onChange={onChange}
          >
            <option value="">Всички</option>
            <option value="Manual">Ръчна</option>
            <option value="Automatic">Автоматична</option>
          </select>
        </div>

        <div className="field">
          <label htmlFor="mileageMax">Пробег до</label>
          <input
            id="mileageMax"
            name="mileageMax"
            type="number"
            value={filters.mileageMax}
            onChange={onChange}
          />
        </div>

        <div className="field">
          <label htmlFor="sort">Сортиране</label>
          <select id="sort" name="sort" value={filters.sort} onChange={onChange}>
            <option value="latest">Най-нови</option>
            <option value="price_asc">Цена възходящо</option>
            <option value="price_desc">Цена низходящо</option>
            <option value="year_desc">Година</option>
          </select>
        </div>
      </div>

      <div className="filters-footer">
        <p className="filters-note">Комбинирай марка, модел, цена, година и трансмисия за по-точни резултати.</p>
        <button className="button" type="submit">
          Покажи резултати
        </button>
      </div>
    </form>
  );
}

export default ListingFilters;
