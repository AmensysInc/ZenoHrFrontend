// #css file for TableFilter
import React, { useState, useRef, useEffect } from "react";
import {
  Row,
  Col,
  Input,
  Button,
  Space,
  Tag,
  Select,
  Radio,
  Modal,
  Badge,
} from "antd";
import {
  SearchOutlined,
  DownOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { FilterOutlined, FilterFilled } from "@ant-design/icons";
import { AiOutlineReload } from "react-icons/ai";

const { Option } = Select;

// DEFAULT FILTERS (USED FOR RESET) - Empty by default
const defaultFilters = [];

export default function TableFilter({ 
  onSearch, 
  onFiltersChange, 
  fieldOptions: customFieldOptions,
  searchPlaceholder = "Search by name, email, or other fields...",
}) {
  const [filters, setFilters] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  const [popupOpen, setPopupOpen] = useState(false);
  const [showFilterCard, setShowFilterCard] = useState(false);

  const [selectedField, setSelectedField] = useState("");
  const [selectedOperator, setSelectedOperator] = useState("is");
  const [filterValue, setFilterValue] = useState("");

  const [popupPos, setPopupPos] = useState({ top: 0, left: 0 });
  const plusButtonRef = useRef(null);

  const [cardDirection, setCardDirection] = useState("right");

  // Chip edit popup
  const [editingFilter, setEditingFilter] = useState(null);
  const [chipPopupPos, setChipPopupPos] = useState({ top: 0, left: 0 });

  // Filters popup (under Filters button)
  const [filtersPopupOpen, setFiltersPopupOpen] = useState(false);
  const [filtersPopupPos, setFiltersPopupPos] = useState({ top: 0, left: 0 });
  const filtersButtonRef = useRef(null);

  // Collapsible sections inside Filters popup
  const [activeSectionOpen, setActiveSectionOpen] = useState(true);
  const [savedSectionOpen, setSavedSectionOpen] = useState(true);

  // Saved filter presets
  const [savedFilters, setSavedFilters] = useState([]);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [presetName, setPresetName] = useState("");

  const defaultFieldOptions = [
    "Name",
    "Email",
    "Status",
    "Date",
    "Phone",
    "Company",
  ];

  const fieldOptions = customFieldOptions || defaultFieldOptions;

  const operatorOptions = [
    "is",
    "is not",
    "contains",
    "has any value",
    "is greater than",
    "is between",
  ];

  // Load saved presets from localStorage
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("tableFilterPresets");
      if (stored) {
        setSavedFilters(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load saved presets", e);
    }
  }, []);

  // Persist presets to localStorage
  useEffect(() => {
    try {
      window.localStorage.setItem(
        "tableFilterPresets",
        JSON.stringify(savedFilters)
      );
    } catch (e) {
      console.error("Failed to save presets", e);
    }
  }, [savedFilters]);

  // Notify parent when filters change
  useEffect(() => {
    if (onFiltersChange) {
      onFiltersChange(filters);
    }
  }, [filters, onFiltersChange]);

  // Handle search value changes
  useEffect(() => {
    if (onSearch) {
      onSearch(searchValue);
    }
  }, [searchValue, onSearch]);

  // Click outside handlers for popups
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close + popup
      if (popupOpen) {
        const popupElement = document.querySelector('[data-popup="add-filter"]');
        const isClickInsidePopup = popupElement && popupElement.contains(event.target);
        const isClickOnButton = plusButtonRef.current && plusButtonRef.current.contains(event.target);
        
        if (!isClickInsidePopup && !isClickOnButton) {
          closePopup();
        }
      }

      // Close filters popup
      if (filtersPopupOpen) {
        const filtersPopupElement = document.querySelector('[data-popup="filters"]');
        const isClickInsidePopup = filtersPopupElement && filtersPopupElement.contains(event.target);
        const isClickOnButton = filtersButtonRef.current && filtersButtonRef.current.contains(event.target);
        
        if (!isClickInsidePopup && !isClickOnButton) {
          setFiltersPopupOpen(false);
        }
      }

      // Close chip edit popup
      if (editingFilter) {
        const chipPopupElement = document.querySelector('[data-popup="chip-edit"]');
        const isClickInsidePopup = chipPopupElement && chipPopupElement.contains(event.target);
        const clickedTag = event.target.closest('.ant-tag');
        
        if (!isClickInsidePopup && !clickedTag) {
          setEditingFilter(null);
        }
      }
    };

    if (popupOpen || filtersPopupOpen || editingFilter) {
      // Use setTimeout to avoid immediate closure when opening
      setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside);
      }, 100);
      
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [popupOpen, filtersPopupOpen, editingFilter]);

  const removeFilter = (id) => {
    setFilters((prev) => prev.filter((f) => f.id !== id));
  };

  /** Convert viewport → card-relative */
  const getCardRelativePosition = (viewportLeft, viewportTop) => {
    const card = document.querySelector(".ant-card");
    if (!card) return { left: viewportLeft, top: viewportTop };

    const rect = card.getBoundingClientRect();
    return {
      left: viewportLeft - rect.left,
      top: viewportTop - rect.top,
    };
  };

  /** Return card rect */
  const getCardRect = () => {
    const card = document.querySelector(".ant-card");
    return card ? card.getBoundingClientRect() : null;
  };

  /** + Popup (with boundary clamping) */
  const openPopup = () => {
    const btn = plusButtonRef.current;
    if (!btn) return;

    const rect = btn.getBoundingClientRect();
    const cardRect = getCardRect();

    let viewportLeft = rect.left - 200;
    let viewportTop = rect.bottom - 140 + window.scrollY;

    const popupWidth = 350;
    const popupHeight = 260;

    const { left: rawLeft, top: rawTop } = getCardRelativePosition(
      viewportLeft,
      viewportTop
    );

    let safeLeft = rawLeft;
    let safeTop = rawTop;

    if (cardRect) {
      const maxLeft = cardRect.width - popupWidth - 10;
      const maxTop = cardRect.height - popupHeight - 10;

      safeLeft = Math.max(10, Math.min(rawLeft, maxLeft));
      safeTop = Math.max(10, Math.min(rawTop, maxTop));
    }

    setPopupPos({ top: safeTop, left: safeLeft });
    setPopupOpen(true);

    setShowFilterCard(false);
    setSelectedField("");
    setSelectedOperator("is");
    setFilterValue("");
  };

  const closePopup = () => {
    setPopupOpen(false);
    setShowFilterCard(false);
    setSelectedField("");
    setSelectedOperator("is");
    setFilterValue("");
  };

  const handlePlusClick = () => {
    if (popupOpen) {
      closePopup();
      setTimeout(openPopup, 0);
    } else {
      openPopup();
    }
  };

  const handleFieldClick = (field) => {
    setSelectedField(field);

    const btn = plusButtonRef.current;
    const rect = btn.getBoundingClientRect();
    const cardWidth = 330;

    const spaceRight = window.innerWidth - rect.right;
    const spaceLeft = rect.left;

    if (spaceRight < cardWidth && spaceLeft > cardWidth) {
      setCardDirection("left");
    } else {
      setCardDirection("right");
    }

    setShowFilterCard(true);
  };

  /** Add filter from + popup */
  const addFilter = () => {
    if (selectedField && filterValue) {
      setFilters((prev) => [
        ...prev,
        {
          id: Date.now(),
          field: selectedField,
          operator: selectedOperator,
          value:
            selectedOperator === "is between"
              ? `$${filterValue.min} and $${filterValue.max}`
              : filterValue,
        },
      ]);
      closePopup();
    }
  };

  /** Clear & reset filters */
  const clearAllFilters = () => {
    setFilters([]);
  };

  const resetToDefaultFilters = () => {
    setFilters(defaultFilters);
  };

  /** Save preset modal logic */
  const openSavePresetModal = () => {
    if (!filters.length) {
      Modal.info({
        title: "No filters to save",
        content: "Add at least one filter before saving a filter set.",
      });
      return;
    }
    setPresetName("");
    setIsSaveModalOpen(true);
  };

  const handleSavePreset = () => {
    const name = presetName.trim();
    if (!name) return;

    const toStore = filters.map((f) => ({
      field: f.field,
      operator: f.operator,
      value: f.value,
    }));

    setSavedFilters((prev) => [
      ...prev,
      {
        id: Date.now(),
        name,
        filters: toStore,
      },
    ]);

    setIsSaveModalOpen(false);
  };

  const applyPreset = (preset) => {
    const applied = preset.filters.map((f, index) => ({
      id: Date.now() + index,
      field: f.field,
      operator: f.operator,
      value: f.value,
    }));
    setFilters(applied);
  };

  const deletePreset = (id) => {
    setSavedFilters((prev) => prev.filter((p) => p.id !== id));
  };

  /** Filters popup — boundary safe */
  const toggleFiltersPopup = () => {
    if (filtersPopupOpen) {
      setFiltersPopupOpen(false);
      return;
    }

    const btn = filtersButtonRef.current;
    if (!btn) return;

    const rect = btn.getBoundingClientRect();
    const cardRect = getCardRect();

    let viewportLeft = rect.left - 90;
    let viewportTop = rect.bottom + window.scrollY - 145;

    const popupWidth = 260;
    const popupHeight = 320;

    const { left: rawLeft, top: rawTop } = getCardRelativePosition(
      viewportLeft,
      viewportTop
    );

    let safeLeft = rawLeft;
    let safeTop = rawTop;

    if (cardRect) {
      const maxLeft = cardRect.width - popupWidth - 10;
      const maxTop = cardRect.height - popupHeight - 10;

      safeLeft = Math.max(10, Math.min(rawLeft, maxLeft));
      safeTop = Math.max(10, Math.min(rawTop, maxTop));
    }

    setFiltersPopupPos({ top: safeTop, left: safeLeft });
    setFiltersPopupOpen(true);
  };


  return (
    <div
      style={{
        width: "100%",
        padding: 16,
        position: "relative",
      }}
    >
      {/* Search */}
      <Row
        gutter={12}
        style={{
          marginBottom: 12,
          display: "flex",
          alignItems: "center",
          margin: 0,
        }}
      >
        <Col flex="auto">
          <Input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder={searchPlaceholder}
            prefix={<SearchOutlined style={{ color: "#aaa" }} />}
            style={{ borderRadius: 8, height: 38 }}
          />
        </Col>

        {/* FILTERS BUTTON */}
        <Col>
          <Badge count={filters.length} offset={[10, 0]} color="#0D2A4D">
            <Button
              ref={filtersButtonRef}
              icon={filtersPopupOpen ? <FilterFilled /> : <FilterOutlined />}
              onClick={toggleFiltersPopup}
              style={{
                borderRadius: 8,
                marginTop: 0,
                height: 38,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                background: filters.length > 0 ? "#0D2A4D" : "#fff",
                borderColor: filters.length > 0 ? "#0D2A4D" : "#d9d9d9",
                color: filters.length > 0 ? "#ffff" : "#000",
                fontWeight: filters.length > 0 ? 600 : 400,
              }}
            >

            </Button>
          </Badge>
        </Col>

        {/* Refresh button */}
        <Col>
          <Button
            icon={<AiOutlineReload />}
            onClick={() => window.location.reload()}
            style={{
              borderRadius: 8,
              marginTop: 0,
              height: 38,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#0D2A4D",
              borderColor: "#0D2A4D",
              color: "#fff",
            }}
          />
        </Col>
      </Row>

      {/* Chips */}
      <Space wrap style={{ width: "100%", marginTop: 6, marginBottom: 8 }}>
        {filters.map((filter) => (
          <Tag
            key={filter.id}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const cardRect = getCardRect();

              let viewportLeft = rect.left - 100;
              let viewportTop = rect.bottom + window.scrollY - 80;

              const popupWidth = 260;
              const popupHeight = 220;

              let { left: rawLeft, top: rawTop } = getCardRelativePosition(
                viewportLeft,
                viewportTop
              );

              let safeLeft = rawLeft;
              let safeTop = rawTop;

              if (cardRect) {
                const maxLeft = cardRect.width - popupWidth - 10;
                const maxTop = cardRect.height - popupHeight - 10;

                safeLeft = Math.max(10, Math.min(rawLeft, maxLeft));
                safeTop = Math.max(10, Math.min(rawTop, maxTop));
              }

              setChipPopupPos({ left: safeLeft, top: safeTop });

              setEditingFilter(filter);
              setSelectedField(filter.field);
              setSelectedOperator(filter.operator);

              if (filter.operator === "is between") {
                const [min, max] = filter.value
                  .replace(/\$/g, "")
                  .split("and")
                  .map((v) => v.trim());
                setFilterValue({ min, max });
              } else {
                setFilterValue(filter.value);
              }
            }}
            closable
            onClose={(e) => {
              e.preventDefault();
              removeFilter(filter.id);
            }}
            style={{
              padding: "4px 8px",
              borderRadius: 999,
              background: "#f3f4f6",
              border: "1px solid #e5e7eb",
              display: "flex",
              alignItems: "center",
              gap: 6,
              cursor: "pointer",
            }}
            closeIcon={
              <CloseOutlined
                style={{ fontSize: 10, padding: 2, borderRadius: "50%" }}
              />
            }
          >
            <span style={{ fontWeight: 500 }}>{filter.field}</span>
            <span style={{ color: "#6b7280" }}>{filter.operator}</span>
            <span style={{ fontWeight: 500 }}>{filter.value}</span>
          </Tag>
        ))}

        {/* + Button */}
        <Button
          ref={plusButtonRef}
          shape="circle"
          type="dashed"
          onClick={handlePlusClick}
          style={{
            borderRadius: 8,
            width: 32,
            height: 32,
            padding: 0,
            margin: 0,
          }}
        >
          +
        </Button>
      </Space>

      {/* + Popup */}
      {popupOpen && (
        <div
          data-popup="add-filter"
          style={{
            position: "absolute",
            top: popupPos.top,
            left: popupPos.left,
            display: "flex",
            flexDirection: cardDirection === "right" ? "row" : "row-reverse",
            gap: 8,
            zIndex: 9999,
          }}
        >
          {/* Left dropdown */}
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              boxShadow:
                "0 3px 8px rgba(0,0,0,0.12), 0 1px 3px rgba(0,0,0,0.08)",
              padding: "8px 0",
              minWidth: 180,
              maxHeight: 260,
              overflowY: "auto",
            }}
          >
            {fieldOptions.map((field) => (
              <div
                key={field}
                onClick={() => handleFieldClick(field)}
                style={{
                  padding: "6px 14px",
                  cursor: "pointer",
                  fontSize: 13,
                  background:
                    selectedField === field ? "#f0f5ff" : "transparent",
                  color: "#111827",
                }}
              >
                {field}
              </div>
            ))}
          </div>

          {/* Add Filter Card */}
          {showFilterCard && (
            <div
              style={{
                background: "#fff",
                borderRadius: 14,
                padding: "16px 40px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                width: 220,
              }}
            >
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>
                Add filter
              </div>

              {/* Field */}
              <div style={{ marginBottom: 10 }}>
                <div style={{ marginBottom: 4, fontSize: 13, fontWeight: 500 }}>
                  Field
                </div>
                <Select
                  value={selectedField || undefined}
                  onChange={setSelectedField}
                  style={{ width: "100%" }}
                >
                  {fieldOptions.map((f) => (
                    <Option key={f} value={f}>
                      {f}
                    </Option>
                  ))}
                </Select>
              </div>

              {/* Condition */}
              <div style={{ marginBottom: 10 }}>
                <div style={{ marginBottom: 4, fontSize: 13, fontWeight: 500 }}>
                  Condition
                </div>
                <Radio.Group
                  value={selectedOperator}
                  onChange={(e) => setSelectedOperator(e.target.value)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                  }}
                >
                  {operatorOptions.map((op) => (
                    <Radio key={op} value={op}>
                      {op}
                    </Radio>
                  ))}
                </Radio.Group>
              </div>

              {/* Value */}
              <div style={{ marginBottom: 10 }}>
                <div style={{ marginBottom: 4, fontSize: 13, fontWeight: 500 }}>
                  Value
                </div>

                {selectedOperator === "is between" ? (
                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      alignItems: "center",
                    }}
                  >
                    <Input
                      placeholder="Min"
                      style={{ width: "45%" }}
                      value={filterValue?.min || ""}
                      onChange={(e) =>
                        setFilterValue((prev) => ({
                          ...prev,
                          min: e.target.value,
                        }))
                      }
                    />

                    <span style={{ fontSize: 12, color: "#6b7280" }}>and</span>

                    <Input
                      placeholder="Max"
                      style={{ width: "45%" }}
                      value={filterValue?.max || ""}
                      onChange={(e) =>
                        setFilterValue((prev) => ({
                          ...prev,
                          max: e.target.value,
                        }))
                      }
                    />
                  </div>
                ) : (
                  <Input
                    placeholder="Value"
                    value={typeof filterValue === "string" ? filterValue : ""}
                    onChange={(e) => setFilterValue(e.target.value)}
                  />
                )}
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                <Button onClick={closePopup}>Cancel</Button>
                <Button
                  type="primary"
                  style={{
                    background: "#0D2A4D",
                    borderColor: "#0D2A4D",
                    color: "#ffff",
                  }}
                  onClick={addFilter}
                  disabled={!selectedField || !filterValue}
                >
                  Apply Filter
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* CHIP EDIT POPUP */}
      {editingFilter && (
        <div
          data-popup="chip-edit"
          style={{
            position: "absolute",
            top: chipPopupPos.top,
            left: chipPopupPos.left,
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 14,
              padding: "16px 18px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
              width: 260,
            }}
          >
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 4 }}>
                Field
              </div>
              <Select
                value={selectedField}
                onChange={setSelectedField}
                style={{ width: "100%" }}
              >
                {fieldOptions.map((f) => (
                  <Option key={f} value={f}>
                    {f}
                  </Option>
                ))}
              </Select>
            </div>

            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 4 }}>
                Condition
              </div>
              <Radio.Group
                value={selectedOperator}
                onChange={(e) => setSelectedOperator(e.target.value)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                }}
              >
                {operatorOptions.map((op) => (
                  <Radio key={op} value={op}>
                    {op}
                  </Radio>
                ))}
              </Radio.Group>
            </div>

            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 4 }}>
                Value
              </div>

              {selectedOperator === "is between" ? (
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <Input
                    placeholder="Min"
                    style={{ width: "45%" }}
                    value={filterValue?.min || ""}
                    onChange={(e) =>
                      setFilterValue((prev) => ({
                        ...prev,
                        min: e.target.value,
                      }))
                    }
                  />

                  <span style={{ fontSize: 12 }}>and</span>

                  <Input
                    placeholder="Max"
                    style={{ width: "45%" }}
                    value={filterValue?.max || ""}
                    onChange={(e) =>
                      setFilterValue((prev) => ({
                        ...prev,
                        max: e.target.value,
                      }))
                    }
                  />
                </div>
              ) : (
                <Input
                  value={typeof filterValue === "string" ? filterValue : ""}
                  onChange={(e) => setFilterValue(e.target.value)}
                />
              )}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <Button onClick={() => setEditingFilter(null)}>Cancel</Button>

              <Button
                type="primary"
                style={{
                  background: "#0D2A4D",
                  borderColor: "#0D2A4D",
                  color: "#ffff",
                }}
                onClick={() => {
                  setFilters((prev) =>
                    prev.map((f) =>
                      f.id === editingFilter.id
                        ? {
                            ...f,
                            field: selectedField,
                            operator: selectedOperator,
                            value:
                              selectedOperator === "is between"
                                ? `$${filterValue.min} and $${filterValue.max}`
                                : filterValue,
                          }
                        : f
                    )
                  );
                  setEditingFilter(null);
                }}
              >
                Apply Filter
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* FILTERS POPUP */}
      {filtersPopupOpen && (
        <div
          data-popup="filters"
          style={{
            position: "absolute",
            top: filtersPopupPos.top,
            left: filtersPopupPos.left,
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 14,
              padding: "12px 14px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
              width: 260,
            }}
          >
            <div
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 6,
              }}
              onClick={() => setActiveSectionOpen((o) => !o)}
            >
              <span style={{ fontSize: 13, fontWeight: 600 }}>
                Active Filters
              </span>
              <DownOutlined
                style={{ fontSize: 10 }}
                rotate={activeSectionOpen ? 0 : -90}
              />
            </div>

            {activeSectionOpen && (
              <div style={{ marginBottom: 10, paddingLeft: 4 }}>
                <Button
                  type="text"
                  style={{ padding: 0, fontSize: 12 }}
                  onClick={clearAllFilters}
                >
                  Clear All
                </Button>
                <br />
                <Button
                  type="text"
                  style={{ padding: 0, fontSize: 12 }}
                  onClick={resetToDefaultFilters}
                >
                  Reset Defaults
                </Button>
              </div>
            )}

            <div
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 6,
                marginTop: 4,
              }}
              onClick={() => setSavedSectionOpen((o) => !o)}
            >
              <span style={{ fontSize: 13, fontWeight: 600 }}>
                Saved Filters
              </span>
              <DownOutlined
                style={{ fontSize: 10 }}
                rotate={savedSectionOpen ? 0 : -90}
              />
            </div>

            {savedSectionOpen && (
              <div style={{ paddingLeft: 4 }}>
                {savedFilters.length === 0 && (
                  <div
                    style={{
                      fontSize: 12,
                      color: "#6b7280",
                      marginBottom: 6,
                    }}
                  >
                    No saved filter sets yet.
                  </div>
                )}

                {savedFilters.map((preset) => (
                  <div
                    key={preset.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: 12,
                      padding: "4px 0",
                      cursor: "pointer",
                    }}
                  >
                    <span
                      onClick={() => applyPreset(preset)}
                      style={{ flex: 1, marginRight: 8 }}
                    >
                      {preset.name}
                    </span>
                    <Button
                      type="text"
                      size="small"
                      style={{ padding: 0, fontSize: 11, color: "#9ca3af" }}
                      onClick={() => deletePreset(preset.id)}
                    >
                      Delete
                    </Button>
                  </div>
                ))}

                <Button
                  type="link"
                  style={{
                    padding: 0,
                    fontSize: 12,
                    marginTop: 6,
                  }}
                  onClick={openSavePresetModal}
                >
                  + Save New Set
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SAVE PRESET MODAL */}
      <Modal
        title="Save Filter Set"
        open={isSaveModalOpen}
        onOk={handleSavePreset}
        onCancel={() => setIsSaveModalOpen(false)}
        okText="Save"
      >
        <div style={{ marginBottom: 8, fontSize: 13 }}>
          Name this filter set:
        </div>
        <Input
          value={presetName}
          onChange={(e) => setPresetName(e.target.value)}
          placeholder="e.g., VIP Customers"
        />
      </Modal>
    </div>
  );
}
