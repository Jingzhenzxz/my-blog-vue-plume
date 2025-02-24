---
title: 数组中的第K个最大元素
createTime: 2025/02/24 00:17:02
permalink: /article/tudej35o/
tags:
   - 堆
   - 快速选择
   - 二分
---
## [215. 数组中的第K个最大元素](https://leetcode.cn/problems/kth-largest-element-in-an-array/)

给定整数数组 `nums` 和整数 `k`，请返回数组中第 `k` 个最大的元素。

请注意，你需要找的是数组排序后的第 `k` 个最大的元素，而不是第 `k` 个不同的元素。

你必须设计并实现时间复杂度为 `O(n)` 的算法解决此问题。

**示例 1:**

```
输入: [3,2,1,5,6,4], k = 2
输出: 5
```

**示例 2:**

```
输入: [3,2,3,1,2,4,5,5,6], k = 4
输出: 4
```

**提示：**

- `1 <= k <= nums.length <= 10^5`
- `-10^4 <= nums[i] <= 10^4`

## 堆排序，小顶堆。

```java
class Solution {
    public int findKthLargest(int[] nums, int k) {
        // 小顶堆，堆顶是最小元素
        Queue<Integer> pq = new PriorityQueue<>();
        
        for (int e : nums) {
            // 每个元素都要过一遍二叉堆
            pq.offer(e);
            // 堆中元素多于 k 个时，删除堆顶元素
            if (pq.size() > k) {
                pq.poll();
            }
        }
        
        // pq 中剩下的是 nums 中 k 个最大元素，
        // 堆顶是最小的那个，即第 k 个最大元素，
        return pq.peek();
    }
}
```

时间复杂度

- 插入操作：对于一个小顶堆，插入操作的时间复杂度是`O(log k)`，因为每次插入新元素后都需要进行上浮调整，以保持堆的性质。堆的高度大约为`log k`。
- 遍历数组：代码中遍历了整个数组`nums`，对于数组中的每一个元素，都执行了一次插入操作。
- 因此，总的时间复杂度为`O(n log k)`，其中`n`是数组`nums`的长度。

空间复杂度

- 优先队列（小顶堆）：在任何时刻，优先队列中最多包含`k`个元素，因此它占用的空间是`O(k)`。
- 其他变量：代码中使用了一些额外的变量（如循环变量等），但它们占用的空间可以忽略不计，对总空间复杂度的影响是常量级的。

## 堆排序-手写堆

假设我们有一个数组`nums = [3,2,1,5,6,4]`，并且`k = 2`，即我们要找到这个数组中第2大的元素。

1. **构建最大堆**

   首先，我们将给定的数组`nums`转换成最大堆。在最大堆中，每个父节点的值都大于或等于它的子节点。
   经过构建，我们得到的最大堆可能如下所示（这只是一个可能的最大堆，实际上最大堆的构建结果可能有多种）：

   ```
   [6, 5, 4, 3, 2, 1]
   ```

   在这个最大堆中，堆顶元素是最大的，即`6`。

2. **调整最大堆**

   接下来，我们需要找到第2大的元素。我们已经知道，最大的元素是`6`，它位于堆顶。
   为了找到第2大的元素，我们将堆顶元素与堆中的最后一个元素交换，然后减小堆的大小（实际上是忽略数组的最后一个元素，因为它现在是最大的元素）。

   交换`6`和`1`后，数组变为：

   ```
   [1, 5, 4, 3, 2, 6]
   ```

   然后我们对当前的堆顶元素`1`进行下沉操作，重新调整为最大堆：

   ```
   [5, 3, 4, 1, 2, 6]
   ```

3. **找到第2大的元素**

   经过上述步骤，最大的元素`6`已经在数组的末尾了，当前的最大堆顶是`5`，它就是第2大的元素。因此，我们直接返回当前的堆顶元素`5`。

```java
class Solution {
    public int findKthLargest(int[] nums, int k) {
        int heapSize = nums.length;
        buildMaxHeap(nums, heapSize); // 初始化：把输入数组转换成最大堆
        
        // 将堆顶（最大值）与数组末尾的元素交换，然后减小堆的大小，最后对堆顶元素进行下沉调整。注意这是k-1次操作，不是k次！
        for (int i = nums.length - 1; i >= nums.length - k + 1; --i) {
            swap(nums, 0, i); // 交换堆顶元素与当前未处理的最后一个元素
            --heapSize; // 缩小堆的范围
            maxHeapify(nums, 0, heapSize); // 对新的堆顶元素执行下沉操作，保持最大堆性质。因为我们只修改了堆中的一个元素，所以只需要maxHepify而不需要buildMaxHeap
        }
        return nums[0]; // 第k-1次操作后，堆顶元素即为第k个最大元素
    }

    public void buildMaxHeap(int[] a, int heapSize) {
        // 从最后一个非叶子节点开始，向上确保每个节点都满足最大堆性质
        for (int i = (heapSize - 1) / 2; i >= 0; --i) {
            maxHeapify(a, i, heapSize);
        } 
    }

    // i 是起点，a 和 heapSize 都是不变的
    public void maxHeapify(int[] a, int i, int heapSize) {
        int l = i * 2 + 1, r = i * 2 + 2; // 左右子节点的索引，索引是从0开始的，如果是从1开始的，则是i*2, i*2+1
        int largest = i; // 假设当前节点是最大值
        
        // 如果左子节点更大，更新最大值的索引
        if (l < heapSize && a[l] > a[largest]) {
            largest = l;
        }
        // 如果右子节点更大，更新最大值的索引
        if (r < heapSize && a[r] > a[largest]) {
            largest = r;
        }
        // 如果最大值不是当前节点，将其与最大子节点交换
        if (largest != i) {
            swap(a, i, largest); // 注意这里只是交换了数组元素，没有交换large和i的值，即largest还是指向子节点，此时子节点不是最大值了。
            // 对交换后可能违反最大堆性质的子树进行调整
            maxHeapify(a, largest, heapSize);
        }
    }

    public void swap(int[] a, int i, int j) {
        // 交换两个元素
        int temp = a[i];
        a[i] = a[j];
        a[j] = temp;
    }
}
```

- 时间复杂度：O(nlog n)，建堆的时间代价是 O(n)，删除的总代价是 O(klog n)，因为 k<n，故渐进时间复杂为 O(n + klog n)=O(nlog n)。
- 空间复杂度：O(log n)，即递归使用栈空间的空间代价。

maxHeapify的时间复杂度是O(\log n)，因为交换后，它只会递归处理较小的那个子节点的树。即每层只进入一个子节点。

buildMaxHeap的时间复杂度为什么不是O(n logn)而是O(n)呢？因为第 `k` 层的节点数量为 `n/2^(k+1)`，每个节点的高度为 `k`。因此，调用 `maxHeapify` 所需的总时间是这些节点所需时间的总和。即
$$
\begin{aligned}
T(n) &= \sum_{k=0}^{\log n-1} \frac{n}{2^{k+1}}O(\log n-k)\\
&\sim n \sum_{k=0}^{\log n - 1} \frac{\log n - k}{2^{k+1}}\\
&=O(n)
\end{aligned}
$$

## 快速选择，二分查找

假设我们有数组`nums = [3,2,3,1,2,4,5,5,6]`，并且`k = 4`，即我们要找到这个数组中第4大的元素。

初始状态

- `nums = [3,2,3,1,2,4,5,5,6]`
- `k = 4`（第4大的元素）

我们要找的是第4大的元素，也就是排序后倒数第4个元素。在升序排序中，这等价于找到第`n - k = 9 - 4 = 5`小的元素。

第一次快速选择

- 选择`nums[0] = 3`作为基准值`x`。
- 分区操作后，可能的一种情况是：`[2,1,2,3,3,4,5,5,6]`，基准值`3`位于索引`3`的位置。
- 我们要找的索引是`5`，位于基准值右侧，因此接下来只需在右侧子数组`[4,5,5,6]`中继续寻找。

第二次快速选择

- 对于右侧子数组`[4,5,5,6]`，假设我们选择`4`作为基准值。
- 经过分区操作，右侧子数组可能变为：`[4,5,5,6]`，其实在这个特殊情况下数组看起来没有变化，因为`4`已经在它正确的位置上了。
- 基准值`4`的新索引是`0`（相对于子数组），我们要找的索引是`5 - 4 = 1`（继续调整为相对于子数组的索引）。

第三次快速选择

- 我们继续在子数组`[5,5,6]`中寻找第1小的元素。
- 假设选择`5`作为基准值，分区操作可能不会改变数组的顺序，因为所有元素都等于基准值。
- 此时，基准值`5`正好是我们要找的第4大（或者说第5小）的元素。

```java
public class Solution {
    private int quickSelect(List<Integer> nums, int k) {
        // 随机选择基准数
        Random rand = new Random();
        int pivot = nums.get(rand.nextInt(nums.size()));
        
        // 将大于、小于、等于 pivot 的元素划分至 big, small, equal 中
        List<Integer> big = new ArrayList<>();
        List<Integer> equal = new ArrayList<>();
        List<Integer> small = new ArrayList<>();
        for (int num : nums) {
            if (num > pivot)
                big.add(num);
            else if (num < pivot)
                small.add(num);
            else
                equal.add(num);
        }
        
        // 第 k 大元素在 big 中，递归划分
        if (k <= big.size()) return quickSelect(big, k);
        // 第 k 大元素在 small 中，递归划分。k越大，说明数越小。
        if (k > big.size() + equal.size()) {
            return quickSelect(small, k - big.size() - equal.size());
        }
        // 第 k 大元素在 equal 中，直接返回 pivot
        return pivot;
    }

    public int findKthLargest(int[] nums, int k) {
        List<Integer> numList = new ArrayList<>();
        for (int num : nums) {
            numList.add(num);
        }
        return quickSelect(numList, k);
    }
}
```

快速选择算法的平均时间复杂度为`O(n)`，但最坏情况下的时间复杂度为`O(n^2)`。通过随机选择基准值可以减少达到最坏情况的可能性。空间复杂度为`O(log n)`，主要是递归调用栈的开销。

**快速排序和快速选择的区别是，快速排序是排序，需要处理所有元素，快速选择是搜索，找到就返回，类似二叉搜索树**

```java
    public void quickSort(int[] arr, int low, int high) {
        // low,high 为每次处理数组时的首、尾元素索引
        //当low==high是表示该序列只有一个元素，不必排序了
        if (low >= high) {
            return;
        }
        
        // 选出哨兵元素和基准元素。这里左边的哨兵元素也是基准元素
        int i = low, j = high, base = arr[low];
        while (i < j) {
            // 右边哨兵从后向前找
            while (arr[j] >= base && i < j) {
                j--;
            }
            // 左边哨兵从前向后找
            while (arr[i] <= base && i < j) {
                i++;
            }
            swap(arr,i,j);  // 交换元素
        }
        swap(arr,low,j);  // 基准元素与右哨兵交换
        
        // 递归调用，排序左子集合和右子集合
        quickSort(arr,low,j-1);  
        quickSort(arr,j+1,high);

    }

    private void swap(int[] arr, int i, int j) {
        int tmp = arr[i];
        arr[i] = arr[j];
        arr[j] = tmp;
    }
```