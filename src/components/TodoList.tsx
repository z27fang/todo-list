import React from "react";

interface ITodoItem {
  id: string;
  name: string;
  isSelected: boolean;
}

const TodoItem = ({
  item,
  onDeleteClick,
  onToggleCheckbox,
}: {
  item: ITodoItem;
  onDeleteClick: (id: string) => void;
  onToggleCheckbox: (id: string, value: boolean) => void;
}) => {
  const onDelete = () => onDeleteClick(item.id);
  const onCheckboxValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onToggleCheckbox(item.id, e.target.checked);
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
      }}
      key={item.id}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <input
          type="checkbox"
          checked={item.isSelected}
          onChange={onCheckboxValueChange}
        />
        <div>{item.name}</div>
      </div>
      <button aria-label="click button to remove todo item" onClick={onDelete}>
        Delete
      </button>
    </div>
  );
};

const AddTodoItem = ({
  onAddItem,
}: {
  onAddItem: (item: ITodoItem) => void;
}) => {
  const [itemName, setItemName] = React.useState("");
  const onSubmitItem = () => {
    const itemId = crypto.randomUUID();
    onAddItem({
      name: itemName,
      id: itemId,
      isSelected: false,
    });
    setItemName("");
  };

  const onSubmitKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSubmitItem();
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <input
        type="text"
        placeholder="Add your task"
        aria-label="todo item input box"
        value={itemName}
        onChange={(e) => setItemName(e.target.value)}
        onKeyDown={onSubmitKeyDown}
      />
      <button
        aria-label="click button to submit todo-item"
        onClick={onSubmitItem}
      >
        Submit
      </button>
    </div>
  );
};

const DeleteSeletedButton = ({
  listItems,
  onDeleteClick,
}: {
  listItems: ITodoItem[];
  onDeleteClick: (itemIds: string[]) => void;
}) => {
  const shouldShowButton = listItems.some((item) => item.isSelected === true);
  const onClick = () =>
    onDeleteClick(
      listItems.filter((item) => item.isSelected).map((item) => item.id)
    );
  return shouldShowButton ? (
    <button onClick={onClick}>Delete Selected Items</button>
  ) : null;
};

export default function App() {
  const [listItems, setListItems] = React.useState<ITodoItem[]>([]);
  const onDeleteItem = (id: string) => {
    setListItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const onAddItem = (newItem: ITodoItem) => {
    setListItems((prev) => [...prev, newItem]);
  };

  const onDeleteSelectedItems = (itemIds: string[]) => {
    setListItems((prev) => prev.filter((item) => !itemIds.includes(item.id)));
  };

  const onToggleCheckbox = (itemId: string, value: boolean) => {
    const item = listItems.find((item) => item.id === itemId);
    if (!item) {
      return;
    }
    const itemCopy = { ...item, isSelected: value };
    setListItems((prev) => {
      return prev.map((prevItem) => {
        return prevItem.id === itemId ? itemCopy : prevItem;
      });
    });
  };

  return (
    <div style={{ width: "100%" }}>
      <h1>Todo List</h1>
      <div style={{ display: "flex", flexDirection: "row", gap: "16px" }}>
        <AddTodoItem onAddItem={onAddItem} />
        <DeleteSeletedButton
          listItems={listItems}
          onDeleteClick={onDeleteSelectedItems}
        />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
        }}
      >
        {listItems.map((item) => (
          <TodoItem
            key={item.id}
            onDeleteClick={onDeleteItem}
            item={item}
            onToggleCheckbox={onToggleCheckbox}
          />
        ))}
      </div>
    </div>
  );
}
