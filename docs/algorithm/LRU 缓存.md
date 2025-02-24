---
title: LRU 缓存
createTime: 2025/02/24 18:36:02
permalink: /article/p1zxbcie/
---
## [146. LRU 缓存](https://leetcode.cn/problems/lru-cache/)

请你设计并实现一个满足 [LRU (最近最少使用) 缓存](https://baike.baidu.com/item/LRU) 约束的数据结构。

实现 `LRUCache` 类：

- `LRUCache(int capacity)` 以 **正整数** 作为容量 `capacity` 初始化 LRU 缓存
- `int get(int key)` 如果关键字 `key` 存在于缓存中，则返回关键字的值，否则返回 `-1` 。
- `void put(int key, int value)` 如果关键字 `key` 已经存在，则变更其数据值 `value` ；如果不存在，则向缓存中插入该组 `key-value` 。如果插入操作导致关键字数量超过 `capacity` ，则应该 **逐出** 最久未使用的关键字。

函数 `get` 和 `put` 必须以 `O(1)` 的平均时间复杂度运行。

**示例：**

```
输入
["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]
[[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]
输出
[null, null, null, 1, null, -1, null, -1, 3, 4]

解释
LRUCache lRUCache = new LRUCache(2);
lRUCache.put(1, 1); // 缓存是 {1=1}
lRUCache.put(2, 2); // 缓存是 {1=1, 2=2}
lRUCache.get(1);    // 返回 1
lRUCache.put(3, 3); // 该操作会使得关键字 2 作废，缓存是 {1=1, 3=3}
lRUCache.get(2);    // 返回 -1 (未找到)
lRUCache.put(4, 4); // 该操作会使得关键字 1 作废，缓存是 {4=4, 3=3}
lRUCache.get(1);    // 返回 -1 (未找到)
lRUCache.get(3);    // 返回 3
lRUCache.get(4);    // 返回 4
```

**提示：**

- `1 <= capacity <= 3000`
- `0 <= key <= 10000`
- `0 <= value <= 10^5`
- 最多调用 `2 * 10^5` 次 `get` 和 `put`

## LinkedHashMap

哈希表的get和put都是O(1)，put中用到了删除，为了保证删除是O(1)，需要链表。

**到这里就能回答刚才「为什么必须要用双向链表」的问题了，因为我们需要删除操作。删除一个节点不光要得到该节点本身的指针，也需要操作其前驱节点的指针，而双向链表才能支持直接查找前驱，保证操作的时间复杂度 O(1)。**

**注意我们实现的双链表 API 只能从尾部插入，也就是说靠尾部的数据是最近使用的，靠头部的数据是最久未使用的**。

也就是说，**当缓存容量已满，我们不仅仅要删除最后一个 `Node` 节点，还要把 `map` 中映射到该节点的 `key` 同时删除，
而这个 `key` 只能由 `Node` 得到。如果 `Node` 结构中只存储 `val`，那么我们就无法得知 `key` 是什么，就无法删除 `map` 中的键，造成错误。**

```java
class LRUCache {
    int cap;
    Map<Integer, Integer> cache = new LinkedHashMap<>();
    public LRUCache(int capacity) {
        this.cap = capacity;
    }

    // 如果没有，返回-1，否则makeRecently，然后返回
    public int get(int key) {
        if (!cache.containsKey(key)) {
            return -1;
        }
        // 将 key 变为最近使用
        makeRecently(key);
        return cache.get(key);
    }

    // 先检查有没有，如果已有，则修改，然后变为最近使用，如果没有，则新增，注意新增前要坚持是否队列已满。
    public void put(int key, int val) {
        if (cache.containsKey(key)) {
            // 修改 key 的值
            cache.put(key, val);
            // 将 key 变为最近使用
            makeRecently(key);
            return;
        }

        // 也可以先put，再删除，但是要把>=改成>
        if (cache.size() >= this.cap) {
            // 链表头部就是最久未使用的 key
            // 注意这里的写法。
            int oldestKey = cache.keySet().iterator().next();
            cache.remove(oldestKey);
        }
        // 将新的 key 添加链表尾部
        cache.put(key, val);
    }

    private void makeRecently(int key) {
        int val = cache.get(key);
        // 删除 key，重新插入到队尾
        cache.remove(key);
        cache.put(key, val);
    }
}
```

## HashMap+LinkedList+虚拟节点

**问**：需要几个哨兵节点？

**答**：一个就够了。一开始哨兵节点 dummy 的 prev 和 next 都指向 dummy。随着节点的插入，dummy 的 next 指向链表的第一个节点（最上面的书），prev 指向链表的最后一个节点（最下面的书）。

**问**：为什么节点要把 key 也存下来？

**答**：在删除链表末尾节点时，也要删除哈希表中的记录，这需要知道末尾节点的 key。

哈希表是为了让get达到O(1)。

到这里就能回答刚才「为什么必须要用双向链表」的问题了，因为我们需要删除操作。删除一个节点不光要得到该节点本身的指针，
也需要操作其前驱节点的指针，而双向链表才能支持直接查找前驱，保证操作的时间复杂度 O(1)。

```java
public class LRUCache {
    // Node中有key是为了删除哈希表中的键。Node是为了维护顺序。真正存数据的是哈希表，如果不需要顺序，
    // 则哈希表的值是value即可，但是我们需要维护顺序，所以我们封装一个类。
    private static class Node {
        int key, value;
        Node prev, next;

        Node(int k, int v) {
            key = k;
            value = v;
        }
    }

    private final int capacity;
    // 哨兵节点是为了规范代码，dummy 后面的第一个节点是最新的节点，dummy 前面的第一个节点是最旧的节点
    private final Node dummy = new Node(0, 0); // 哨兵节点
    // 哈希表是为了让get达到O(1)，键是key，值是node。哈希表是缓存，双向链表只是为了维护顺序，
    // 真正存数据的是这个keyToNode。keyToNode中要存Node，因为要把keyToNode和双向链表联系起来。
    private final Map<Integer, Node> keyToNode = new HashMap<>();

    public LRUCache(int capacity) {
        this.capacity = capacity;
        dummy.prev = dummy;
        dummy.next = dummy;
    }

    // get一定要维护顺序
    public int get(int key) {
        Node node = getNode(key);
        return node != null ? node.value : -1;
    }

    // put可能需要维护顺序
    public void put(int key, int value) {
        Node node = getNode(key);
        if (node != null) { // 有这本书
            node.value = value; // 更新 value
            return;
        }
        
        node = new Node(key, value); // 创建新书
        keyToNode.put(key, node);
        pushFront(node); // 放在最上面。维护双向链表。
        
        if (keyToNode.size() > capacity) { // 书太多了，要执行删除操作
            // backNode是最老的节点
            Node backNode = dummy.prev;
            // Node中要有key，是因为删除哈希表中的键时要用到。维护集合。重点。
            keyToNode.remove(backNode.key);
            remove(backNode); // 去掉最后一本书。维护顺序。
        }
    }
       
    private Node getNode(int key) {
        if (!keyToNode.containsKey(key)) { // 没有这本书
            return null;
        }
        Node node = keyToNode.get(key); // 有这本书。按理说获取到node.val就可以了，但是我们还要维护顺序，如果只是从哈希表中获取值，那么哈希表中直接存value即可，不必存Node，Node就是为了维护顺序。
        remove(node); // 把这本书抽出来
        pushFront(node); // 放在最上面
        return node;
    }

    // 删除一个节点（抽出一本书）
    private void remove(Node x) {
        x.prev.next = x.next;
        x.next.prev = x.prev;
    }

    // 在链表头添加一个节点（把一本书放在最上面）
    private void pushFront(Node x) {
        x.prev = dummy;
        x.next = dummy.next;
        x.prev.next = x;
        x.next.prev = x;
    }
}
```

- 时间复杂度：所有操作均为 O(1)。
- 空间复杂度：O(capacity)，因为哈希表和双向链表最多存储 capacity+1 个元素。

测试

```java
import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;

public class LRUCacheTest {

    @Test
    public void testLRUCache() {
        // 创建一个容量为 2 的 LRUCache
        LRUCache cache = new LRUCache(2);

        // 测试 put 和 get 操作
        cache.put(1, 1); // 缓存是 {1=1}
        assertEquals(1, cache.get(1)); // 返回 1

        cache.put(2, 2); // 缓存是 {1=1, 2=2}
        assertEquals(2, cache.get(2)); // 返回 2

        cache.put(3, 3); // 该操作会使得 key 1 被移除，缓存是 {2=2, 3=3}
        assertEquals(-1, cache.get(1)); // 返回 -1 (未找到)

        cache.put(4, 4); // 该操作会使得 key 2 被移除，缓存是 {3=3, 4=4}
        assertEquals(-1, cache.get(2)); // 返回 -1 (未找到)

        assertEquals(3, cache.get(3)); // 返回 3
        assertEquals(4, cache.get(4)); // 返回 4
    }

    @Test
    public void testCacheWithSameKey() {
        LRUCache cache = new LRUCache(2);

        cache.put(1, 1); // 缓存是 {1=1}
        cache.put(1, 10); // 更新 key 1 的值，缓存是 {1=10}
        assertEquals(10, cache.get(1)); // 返回 10，更新后的值
    }

    @Test
    public void testCacheCapacityLimit() {
        LRUCache cache = new LRUCache(3);

        // 缓存加入多个元素
        cache.put(1, 1); // 缓存是 {1=1}
        cache.put(2, 2); // 缓存是 {1=1, 2=2}
        cache.put(3, 3); // 缓存是 {1=1, 2=2, 3=3}
        assertEquals(1, cache.get(1)); // 返回 1

        // 超过容量，最旧的元素 2 被移除
        cache.put(4, 4); // 缓存是 {1=1, 3=3, 4=4}
        assertEquals(-1, cache.get(2)); // 返回 -1，key 2 被移除

        // 再次加入新的元素，验证顺序
        cache.put(5, 5); // 缓存是 {3=3, 4=4, 5=5}
        assertEquals(-1, cache.get(1)); // 返回 -1，key 1 被移除
        assertEquals(3, cache.get(3)); // 返回 3
        assertEquals(4, cache.get(4)); // 返回 4
        assertEquals(5, cache.get(5)); // 返回 5
    }

    @Test
    public void testEmptyCache() {
        LRUCache cache = new LRUCache(2);
        assertEquals(-1, cache.get(1)); // 返回 -1 (未找到)
        cache.put(1, 10); // 缓存是 {1=10}
        assertEquals(10, cache.get(1)); // 返回 10
    }
}
```

